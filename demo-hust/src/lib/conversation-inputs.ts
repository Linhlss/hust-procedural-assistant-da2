import {z} from 'zod';
import {activeKnowledge} from './knowledge-meta';
import {addEvidenceCoverage} from './answer-coverage';
import {advance,converse} from './engine';
import {fixtureAdapter,fixtureExtract,openaiExtractHistory} from './extractor';
import {ollamaExtractHistory,type OllamaTrace} from './ollama';
import {geminiExtract,geminiCompose,guardGeminiIntent,GEMINI_TURN_TIMEOUT_MS,type GeminiOptions,type GeminiTrace} from './gemini';
import {recordedInputSchema,factEditSchema,type RecordedInput,type FactEdit} from './input-schema';
import {editMessage,editPatch} from './fact-edits';
import type {Answer,ChatMode,Conclusion,Facts,Patch,Profile} from './types';
export class InputError extends Error{}
export const chatRequestSchema=z.object({messages:z.array(z.string().trim().min(1).max(2000)).min(1).max(24),profile:z.enum(['standard','missing-unit','conflict']).default('standard'),requestId:z.string().min(1).max(100),inputs:z.array(recordedInputSchema).max(23).optional(),edit:factEditSchema.optional()}).strict().superRefine((p,c)=>{if(p.inputs&&p.inputs.length!==p.messages.length-1)c.addIssue({code:'custom',message:'Lịch sử đầu vào không khớp số lượt'});if(p.edit&&p.messages.at(-1)!==editMessage(p.edit))c.addIssue({code:'custom',message:'Nội dung lựa chọn không khớp'});});
type RequestData=z.infer<typeof chatRequestSchema>;
type Options=GeminiOptions&{onTrace?:(trace:OllamaTrace)=>void};
function restore(record:Extract<RecordedInput,{kind:'restore'}>,turn:number,profile:Profile,mode:ChatMode){
 const s=record.state;
 const patch:Patch={intent:'consult',...s.facts,topic:s.requestedTopic,personal:!s.preparationOnly,general:s.consultation===false,declined:s.declined};
 let answer=advance(undefined,patch,turn,profile,mode);const lastEvaluated=s.preparationOnly?[...advance(undefined,{intent:'consult',...s.facts,personal:true},turn,profile,mode).conclusions.filter(c=>c.id!=='preparation'),...answer.conclusions]:answer.conclusions;
 if(s.pendingFunding)answer=advance(answer,{intent:'consult',fundingAction:'unclear',topic:s.requestedTopic,personal:!s.preparationOnly,general:s.consultation===false,declined:s.declined},turn,profile,mode);
 if(s.pendingSituation)answer=advance(answer,{intent:'consult',situationUnclear:true,...s.pendingSituation,pendingSituationAction:s.pendingSituationAction},turn,profile,mode);
 return {answer,lastEvaluated};
}
function allowedEdit(edit:FactEdit,answer?:Answer){
 if(answer?.pendingSituation)throw new InputError('Hãy chọn tiếp tục tình huống trước hoặc bắt đầu tình huống mới trước khi sửa dữ kiện.');
 if(edit.field==='allocation'&&answer?.facts.funding!=='combined')throw new InputError('Chỉ cần phân định nguồn khi kết hợp hai nguồn kinh phí.');
 if(edit.field==='related'&&answer?.facts.funding==='unit')throw new InputError('Nguồn đơn vị không cần điều kiện quan hệ nhiệm vụ.');
}
function guardedPatch(input:Extract<RecordedInput,{kind:'message'}>,text:string):Patch{
 const guard=fixtureExtract(text,{});return guard.intent==='out'||guard.intent==='unsupported'?guard:input.patch;
}
// Offline regression of recorded, validated inputs. Never invokes an adapter.
export async function replayRecordedInputs(messages:string[],inputs:RecordedInput[],profile:Profile='standard'):Promise<Answer>{
 if(!messages.length||messages.length!==inputs.length)throw new InputError('Thiếu dữ kiện đã ghi nhận để phát lại.');
 const validated=inputs.map(r=>recordedInputSchema.parse(r));
 const restored=validated.findLastIndex(r=>r.kind==='restore');
 let previous:Answer|undefined,lastEvaluated:Conclusion[]=[];
 if(restored>=0){const result=restore(validated[restored] as Extract<RecordedInput,{kind:'restore'}>,restored+1,profile,'fixture');previous=result.answer;lastEvaluated=result.lastEvaluated;}
 for(let i=restored+1;i<validated.length;i++){
  const r=validated[i];if(r.kind==='legacy'||r.kind==='restore')throw new InputError('Lượt cũ chưa có dữ kiện để phát lại.');
  if(r.kind==='fact-edit')allowedEdit(r.edit,previous);
  const patch=r.kind==='message'?guardedPatch(r,messages[i]):editPatch(r.edit,previous);
  previous=await converse([messages[i]],profile,async()=>patch,'fixture',{initial:previous,lastEvaluated,turnOffset:i,onEvaluated:c=>{lastEvaluated=c;}});
 }
 if(!previous)throw new InputError('Không có trạng thái để phát lại.');
 return addEvidenceCoverage(previous,messages.at(-1)??'');
}
async function processInputs(raw:RequestData,mode:ChatMode,options:Options={}){
 const data=chatRequestSchema.parse(raw);const {messages,profile}=data;
 // Old clients keep their original extraction behavior; return records for future requests.
 if(!data.inputs&&!data.edit){
  const extracted=mode==='gemini'?(messages.every(m=>guardGeminiIntent(m))?messages.map(m=>guardGeminiIntent(m)!):await geminiExtract(messages,{},options)):mode==='ollama'?await ollamaExtractHistory(messages,{},options):mode==='openai'?await openaiExtractHistory(messages):undefined;
  let index=0;const inputs:RecordedInput[]=[];
  const answer=await converse(messages,profile,extracted?async()=>extracted[index++]:fixtureAdapter,mode,{onExtract:patch=>inputs.push({kind:'message',patch})});
  return {answer,inputs};
 }
 const inputs:RecordedInput[]=[...(data.inputs??[])];
 if(inputs.length!==messages.length-1)throw new InputError('Cần khôi phục ngữ cảnh hội thoại trước khi cập nhật.');
 const restored=inputs.findLastIndex(r=>r.kind==='restore');
 if(inputs.some((r,i)=>r.kind==='legacy'&&i>=restored))throw new InputError('Lịch sử cũ chưa có dữ kiện khôi phục hợp lệ.');
 let previous:Answer|undefined,lastEvaluated:Conclusion[]=[];
 if(restored>=0){const base=restore(inputs[restored] as Extract<RecordedInput,{kind:'restore'}>,restored+1,profile,mode);previous=base.answer;lastEvaluated=base.lastEvaluated;}
 for(let i=restored+1;i<inputs.length;i++){
  const input=inputs[i];if(input.kind==='legacy'||input.kind==='restore')throw new InputError('Lịch sử đầu vào không hợp lệ.');
  if(input.kind==='fact-edit')allowedEdit(input.edit,previous);
  const patch=input.kind==='message'?guardedPatch(input,messages[i]):editPatch(input.edit,previous);
  previous=await converse([messages[i]],profile,async()=>patch,mode,{initial:previous,lastEvaluated,turnOffset:i,onEvaluated:c=>{lastEvaluated=c;}});
 }
 const index=messages.length-1;let recorded:RecordedInput|undefined;
 if(data.edit)allowedEdit(data.edit,previous);
 const answer=await converse([messages[index]],profile,async(text,facts:Facts)=>{
  let patch:Patch;
  if(data.edit){patch=editPatch(data.edit,previous);recorded={kind:'fact-edit',edit:data.edit};}
  else{patch=mode==='gemini'?(guardGeminiIntent(text)??(await geminiExtract(messages,facts,{...options,focusIndex:index,state:previous?{question:previous.question,clarification:previous.clarification?.field,pendingFunding:previous.pendingFunding,pendingSituation:previous.pendingSituation,requestedTopic:previous.requestedTopic,preparationOnly:previous.preparationOnly}:null}))[0]):mode==='ollama'?(await ollamaExtractHistory(messages,facts,{...options,focusIndex:index}))[0]:mode==='openai'?(await openaiExtractHistory(messages)).at(-1)!:await fixtureAdapter(text,facts);recorded={kind:'message',patch};}
  return patch;
 },mode,{initial:previous,lastEvaluated,turnOffset:index});
 if(data.edit)answer.inputMethod='fact-edit';
 return {answer,inputs:[...inputs,recorded!]};
}

export async function processConversation(raw:RequestData,mode:ChatMode,options:Options={}){
 activeKnowledge();
 if(mode!=='gemini'){const result=await processInputs(raw,mode,options);result.answer=addEvidenceCoverage(result.answer,raw.messages.at(-1)??'');return result;}
 const timeout=AbortSignal.timeout(GEMINI_TURN_TIMEOUT_MS);
 const signal=options.signal?AbortSignal.any([options.signal,timeout]):timeout;
 const stages:GeminiTrace[]=[],guards:{field:keyof Facts;reason:string}[]=[];
 const scoped={...options,signal,traceId:raw.requestId,onGroundingGuard:(guard:{field:keyof Facts;reason:string})=>{guards.push(guard);options.onGroundingGuard?.(guard);},onGeminiTrace:(trace:GeminiTrace)=>{stages.push(trace);options.onGeminiTrace?.(trace);}};
 const result=await processInputs(raw,mode,scoped);
 result.answer=addEvidenceCoverage(result.answer,raw.messages.at(-1)??'');
 if(!raw.edit)result.answer=await geminiCompose(result.answer,raw.messages,scoped);
 if(stages.length)result.answer.modelRun={provider:'gemini',model:result.answer.narrative?.model??stages[0].model,...(guards.length?{guards}:{}),stages:stages.map(t=>({attempt:t.attempt,phase:t.phase,elapsedMs:t.elapsedMs,status:t.status,usage:(t.body as {usageMetadata?:unknown}|null)?.usageMetadata??null}))};
 return result;
}
