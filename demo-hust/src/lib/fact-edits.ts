import type {Answer,Patch} from './types';
import type {FactEdit,RecordedInput} from './input-schema';
import {factValue,labels} from './presentation';
export function editMessage(edit:FactEdit){return edit.value===null?`Tôi cập nhật: chưa xác định ${labels[edit.field].toLowerCase()}.`:`Tôi cập nhật ${labels[edit.field].toLowerCase()}: ${factValue(edit.field,edit.value)}${edit.field==='funding'&&edit.value!=='combined'?' (chỉ dùng nguồn này)':''}.`;}
export function editPatch(edit:FactEdit,previous?:Answer):Patch{
 return {intent:'consult',personal:!previous?.preparationOnly,general:previous?.consultation===false,topic:previous?.requestedTopic,...(edit.value===null?{clear:[edit.field]}:{[edit.field]:edit.value}),...(edit.field==='funding'?{fundingAction:edit.value==='combined'?'combine':'replace'}:{})};
}
export function declaredState(answer:Answer){return {facts:answer.facts,pendingFunding:answer.pendingFunding,pendingSituation:answer.pendingSituation,pendingSituationAction:answer.pendingSituationAction,declined:answer.declined,requestedTopic:answer.requestedTopic,preparationOnly:answer.preparationOnly,consultation:answer.consultation};}
export function recordedInputs(turns:{input?:RecordedInput;answer:Answer}[]):RecordedInput[]{
 let lastMissing=-1;turns.forEach((t,i)=>{if(!t.input||t.input.kind==='legacy')lastMissing=i;});
 return turns.map((t,i)=>i<lastMissing?{kind:'legacy'}:i===lastMissing?{kind:'restore',state:declaredState(t.answer)}:t.input!);
}
