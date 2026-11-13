import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { openaiExtractHistory } from '../src/lib/extractor';
import { converse } from '../src/lib/engine';
import { POST } from '../src/app/api/chat/route';
import type { Answer,Profile } from '../src/lib/types';

const full='Hội thảo tại Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
const empty=()=>({intent:'consult',unsupportedTopic:null,activity:null,location:null,date:null,
 funding:null,related:null,allocation:null,fundingAction:null,topic:null,personal:false,
 general:false,declined:false,ambiguous:false,newSituation:false,sameSituation:false,
 situationUnclear:false,pendingSituationAction:null,clear:[] as string[]});
const initial=()=>({...empty(),activity:'conference',location:'domestic',date:'2026-11-15',funding:'task',related:true,personal:true});
type ModelPatch=Record<string,unknown>;
const records:Record<string,unknown>={};
const response=(patches:unknown[])=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({patches})}]}]});

async function withMock<T>(body:unknown,run:()=>Promise<T>,inspect?:(payload:Record<string,unknown>)=>void) {
 const savedFetch=globalThis.fetch;
 const saved={key:process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL,adapter:process.env.CHAT_ADAPTER};
 process.env.OPENAI_API_KEY='test-only-placeholder';process.env.OPENAI_MODEL='mock';
 let calls=0;
 globalThis.fetch=async(url,options)=>{
  calls++;assert.equal(String(url),'https://api.openai.com/v1/responses');
  const payload=JSON.parse(String(options?.body));assert.equal(payload.store,false);
  inspect?.(payload);return Response.json(body);
 };
 try {return {value:await run(),calls};}
 finally {
  globalThis.fetch=savedFetch;
  for(const [key,value] of Object.entries({OPENAI_API_KEY:saved.key,OPENAI_MODEL:saved.model,CHAT_ADAPTER:saved.adapter})){
   if(value===undefined)delete process.env[key];else process.env[key]=value;
  }
 }
}

async function dialogue(id:string,messages:string[],patches:ModelPatch[],profile:Profile='standard') {
 const result=await withMock(response(patches),async()=>{
  const parsed=await openaiExtractHistory(messages);let index=0;
  return converse(messages,profile,async()=>parsed[index++],'openai');
 });
 assert.equal(result.calls,1);
 records[id]={messages,mock_patches:patches,answer:result.value};
 return result.value;
}
const conclusion=(a:Answer,id:string)=>a.conclusions.find(c=>c.id===id);

test('model boundary requests strict complete turn patches and preserves false-valued facts',async()=>{
 const patch={...initial(),related:false,allocation:false};
 const {value,calls}=await withMock(response([patch]),()=>openaiExtractHistory([full]),payload=>{
  const format=(payload.text as {format:Record<string,unknown>}).format;
  assert.equal(format.type,'json_schema');assert.equal(format.strict,true);
  const schema=format.schema as {properties:{patches:{items:{properties:Record<string,unknown>;required:string[];additionalProperties:boolean}}}};
  const item=schema.properties.patches.items;
  assert.equal(item.additionalProperties,false);
  assert.deepEqual([...item.required].sort(),Object.keys(item.properties).sort());
  for(const key of ['clear','newSituation','sameSituation','situationUnclear','topic','unsupportedTopic'])assert.ok(key in item.properties);
 });
 assert.equal(calls,1);assert.equal(value[0].related,false);assert.equal(value[0].allocation,false);
});

test('model date withdrawal clears only date and suspends its dependent conclusions',async()=>{
 const answer=await dialogue('date-withdrawal',[full,'Ngày đó tôi nhớ chưa chắc, để tôi kiểm tra lại.'],[initial(),{...empty(),ambiguous:true,clear:['date']}]);
 assert.equal(answer.facts.date,undefined);assert.equal(answer.facts.location,'domestic');
 assert.equal(answer.facts.funding,'task');assert.equal(answer.clarification?.field,'date');
 assert.equal(conclusion(answer,'common')?.status,'insufficient');
});

test('model funding withdrawal retains date and location rather than clearing unrelated facts',async()=>{
 const answer=await dialogue('funding-withdrawal',[full,'Nguồn này chưa chốt, tôi cần xác nhận lại.'],[initial(),{...empty(),ambiguous:true,clear:['funding']}]);
 assert.equal(answer.facts.funding,undefined);assert.equal(answer.facts.date,'2026-11-15');
 assert.equal(answer.facts.location,'domestic');assert.equal(answer.clarification?.field,'funding');
});

test('model replacement retires task-only sources while retaining common evidence',async()=>{
 const answer=await dialogue('replace',[full,'Khoản này sẽ chuyển hẳn về nguồn của đơn vị.'],[initial(),{...empty(),funding:'unit',fundingAction:'replace'}],'missing-unit');
 assert.equal(answer.facts.funding,'unit');assert.equal(conclusion(answer,'task'),undefined);
 assert.equal(conclusion(answer,'common')?.status,'meets');assert.equal(conclusion(answer,'unit')?.status,'insufficient');
 assert.ok(answer.revisions.some(r=>r.id==='task'));
 assert.ok(!answer.conclusions.flatMap(c=>c.sources).some(s=>s.id==='SIM-NV-1'));
});

test('model combination asks allocation and keeps the task condition',async()=>{
 const answer=await dialogue('combine',[full,'Tôi muốn dùng thêm nguồn của cơ quan cùng với đề tài.'],[initial(),{...empty(),funding:'combined',fundingAction:'combine'}]);
 assert.equal(answer.facts.funding,'combined');assert.equal(answer.clarification?.field,'allocation');
 assert.ok(conclusion(answer,'task'));assert.ok(conclusion(answer,'unit'));
});

test('unclear funding relation cannot silently replace the previous source',async()=>{
 const answer=await dialogue('unclear-source',[full,'Cơ quan có hỗ trợ khoản này.'],[initial(),{...empty(),funding:'unit',fundingAction:'unclear'}]);
 assert.equal(answer.facts.funding,'task');assert.equal(answer.pendingFunding,true);
 assert.equal(answer.clarification?.field,'fundingRelation');
});

test('model recognizes an unconfirmed new situation without leaking old date or funding',async()=>{
 const messages=[full,'Một hội thảo khác ở Nhật Bản thì sao?'];
 const pending={...empty(),activity:'conference',location:'foreign',situationUnclear:true};
 const answer=await dialogue('pending-situation',messages,[initial(),pending]);
 assert.equal(answer.facts.date,'2026-11-15');assert.equal(answer.pendingSituation?.location,'foreign');
 assert.equal(answer.pendingSituation?.date,undefined);assert.equal(answer.clarification?.field,'situationRelation');
 const next=await dialogue('new-situation',[...messages,'Tách thành trường hợp riêng giúp tôi nhé.'],[initial(),pending,{...empty(),newSituation:true}]);
 assert.equal(next.facts.location,'foreign');assert.equal(next.facts.date,undefined);assert.equal(next.facts.funding,undefined);
 assert.equal(next.pendingSituation,undefined);
});

test('model confirmation of the same situation merges pending facts and keeps valid context',async()=>{
 const answer=await dialogue('same-situation',[full,'Một hội thảo khác ở Nhật Bản thì sao?','Tôi vẫn đang nói về chuyến vừa rồi nhé.'],[
  initial(),{...empty(),activity:'conference',location:'foreign',situationUnclear:true},{...empty(),sameSituation:true},
 ]);
 assert.equal(answer.facts.location,'foreign');assert.equal(answer.facts.date,'2026-11-15');
 assert.equal(answer.facts.funding,'task');assert.equal(answer.pendingSituation,undefined);
});

test('model topic and unsupported intent remain distinct from a completed T6 consultation',async()=>{
 const prepared=await dialogue('documents',[full,'Cho tôi biết bộ giấy tờ phải mang theo.'],[initial(),{...empty(),topic:'documents'}]);
 assert.equal(prepared.requestedTopic,'documents');assert.ok(conclusion(prepared,'preparation'));
 const unsupported=await dialogue('unsupported',['Tôi cần hướng dẫn về chương trình học tập dài hạn dành cho cán bộ.'],[{...empty(),intent:'unsupported',unsupportedTopic:'training'}]);
 assert.equal(unsupported.intent,'unsupported');assert.equal(unsupported.conclusions.length,0);assert.match(unsupported.text,/T10/);
});

test('model cannot introduce fabricated conclusions or policy fields',async()=>{
 await withMock(response([{...initial(),conclusion:'Được chi trả',source:'INVENTED'}]),async()=>{
  await assert.rejects(openaiExtractHistory([full]));
 });
});

test('invalid model dates, overlapping clear/value and contradictory situation flags are rejected',async()=>{
 for(const patch of [
  {...initial(),date:'2026-02-31'},
  {...initial(),clear:['funding']},
  {...empty(),newSituation:true,sameSituation:true},
  {...empty(),ambiguous:true},
  {...empty(),intent:'unsupported'},
  {...empty(),fundingAction:'combine',funding:'unit'},
 ])await withMock(response([patch]),async()=>{await assert.rejects(openaiExtractHistory([full]));});
});

test('model refusal and incomplete output never become a successful answer',async()=>{
 for(const body of [
  {...response([initial()]),status:'incomplete'},
  {status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'Cannot extract'}]}]},
  response([]),
 ])await withMock(body,async()=>{await assert.rejects(openaiExtractHistory([full]));});
});

test('API returns explicit failure for a bad model response without substituting the fixture',async()=>{
 await withMock(response([{...initial(),date:'2026-02-31'}]),async()=>{
  process.env.CHAT_ADAPTER='openai';
  const result=await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({messages:[full],requestId:'model-failure'})}));
  assert.equal(result.status,503);const body=await result.json();assert.equal(body.answer,undefined);
  assert.match(body.error,/Không có kết luận mới/);
 });
});

test.after(async()=>{
 const dir=process.env.HUST_TEST_ARTIFACT_DIR??'artifacts/demo-runs/week6-model-preparation-2026-11-07';
 await mkdir(dir,{recursive:true});await writeFile(`${dir}/model-adapter-transcripts.json`,JSON.stringify({generatedAt:new Date().toISOString(),mode:'mock_openai',live_model_called:false,policy_validation:false,records},null,2));
});
