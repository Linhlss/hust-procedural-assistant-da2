import test from 'node:test';
import assert from 'node:assert/strict';
import {processConversation,chatRequestSchema} from '../src/lib/conversation-inputs';
import {editMessage,recordedInputs} from '../src/lib/fact-edits';
import type {FactEdit,RecordedInput} from '../src/lib/input-schema';
import {converse} from '../src/lib/engine';
import {appendTurn,freshConversation,readHistory,saveConversation} from '../src/lib/history';
import {sourceById} from '../src/lib/sources';
import type {Profile} from '../src/lib/types';
async function editAll(edits:FactEdit[],profile:Profile='standard'){
 let messages:string[]=[],inputs:RecordedInput[]=[];let result;
 for(const edit of edits){messages.push(editMessage(edit));result=await processConversation({messages,profile,requestId:'edit',inputs,edit},'ollama');inputs=result.inputs;}
 return {result:result!,messages,inputs};
}
const full:FactEdit[]=[{field:'activity',value:'conference'},{field:'location',value:'domestic'},{field:'date',value:'2026-11-15'},{field:'funding',value:'task'},{field:'related',value:true}];
test('explicit field edits do not call any model and preserve false separately from unknown',async()=>{
 const old=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('offline');};
 try{
  const {result,messages,inputs}=await editAll(full);assert.equal(result.answer.facts.related,true);assert.equal(result.answer.inputMethod,'fact-edit');assert.equal(result.answer.turn,5);
  const no:FactEdit={field:'related',value:false};messages.push(editMessage(no));const a=await processConversation({messages,inputs,edit:no,profile:'standard',requestId:'no'},'ollama');assert.equal(a.answer.facts.related,false);assert.equal(a.answer.conclusions.find(c=>c.id==='task')?.status,'fails');
  const clear:FactEdit={field:'related',value:null};messages.push(editMessage(clear));const b=await processConversation({messages,inputs:a.inputs,edit:clear,profile:'standard',requestId:'clear'},'ollama');assert.equal(b.answer.facts.related,undefined);assert.equal(b.answer.clarification?.field,'related');assert.equal(calls,0);
 }finally{globalThis.fetch=old;}
});
test('funding replaces or combines explicitly, retires task-only guidance and checks allocation',async()=>{
 const unit=await editAll([...full,{field:'funding',value:'unit'}]);assert.equal(unit.result.answer.facts.funding,'unit');assert.equal(unit.result.answer.pendingFunding,false);assert.ok(!unit.result.answer.conclusions.some(c=>c.id==='task'));assert.ok(unit.result.answer.revisions.some(r=>r.id==='task'));
 const combined=await editAll([...full,{field:'funding',value:'combined'},{field:'allocation',value:true}]);assert.equal(combined.result.answer.conclusions.find(c=>c.id==='unit')?.status,'meets');
 const unknown=await editAll([...full,{field:'funding',value:'combined'},{field:'allocation',value:true},{field:'allocation',value:null}]);assert.equal(unknown.result.answer.facts.allocation,undefined);assert.equal(unknown.result.answer.clarification?.field,'allocation');
});
test('clear and change date reselect versions; invalid days are rejected at the API schema',async()=>{
 const old=await editAll([...full,{field:'location',value:'foreign'},{field:'date',value:'2025-11-15'}]);assert.ok(old.result.answer.conclusions.some(c=>c.sources.some(s=>s.id==='SIM-CT-2025')));assert.equal(old.result.answer.conclusions.find(c=>c.id==='common')?.status,'fails');
 const clear=await editAll([...full,{field:'date',value:null}]);assert.equal(clear.result.answer.facts.date,undefined);assert.equal(clear.result.answer.clarification?.field,'date');
 assert.equal(chatRequestSchema.safeParse({messages:['x'],requestId:'bad',edit:{field:'date',value:'2026-02-31'}}).success,false);
});
test('missing/conflicting sources remain insufficient after explicit edits',async()=>{
 const unit=await editAll([...full,{field:'funding',value:'unit'}],'missing-unit');assert.equal(unit.result.answer.conclusions.find(c=>c.id==='unit')?.status,'insufficient');
 const conflict=await editAll(full,'conflict');assert.equal(conflict.result.answer.conclusions.find(c=>c.id==='common')?.status,'insufficient');
 for(const a of [unit,conflict])for(const c of a.result.answer.conclusions)for(const s of c.sources)assert.equal(sourceById(s.id)?.quote,s.quote);
});
test('old history is restored as declared facts, never as client-provided conclusions',async()=>{
 const answer=await converse(['Tôi dự hội thảo ở Hà Nội ngày 15/11/2026, dùng kinh phí nhiệm vụ, có phục vụ nhiệm vụ.']);
 const history=appendTurn(freshConversation(),{user:'Tình huống đã khai báo.',answer});const inputs=recordedInputs(history.turns);assert.equal(inputs[0].kind,'restore');
 const edit:FactEdit={field:'funding',value:'unit'};const r=await processConversation({messages:[history.turns[0].user,editMessage(edit)],inputs,edit,profile:'standard',requestId:'legacy'},'ollama');assert.equal(r.answer.facts.date,'2026-11-15');assert.equal(r.answer.facts.funding,'unit');assert.ok(!r.answer.conclusions.some(c=>c.id==='task'));
 assert.equal(chatRequestSchema.safeParse({messages:['a','b'],requestId:'bad',inputs:[{kind:'restore',state:{facts:{},conclusions:[]}}]}).success,false);
 const memory=new Map<string,string>();const store={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{memory.set(k,v);},removeItem:(k:string)=>{memory.delete(k);}};
 saveConversation(store,appendTurn(history,{user:editMessage(edit),answer:r.answer,input:r.inputs.at(-1)}));assert.equal(readHistory(store)[0].turns[1].input?.kind,'fact-edit');
});
test('cached extraction remains stable across mixed chat and form turns',async()=>{
 const text='Tôi dự hội thảo ở Hà Nội ngày 15/11/2026, dùng kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
 const first=await processConversation({messages:[text],inputs:[],profile:'standard',requestId:'a'},'fixture');
 const edit:FactEdit={field:'location',value:'foreign'};const second=await processConversation({messages:[text,editMessage(edit)],inputs:first.inputs,edit,profile:'standard',requestId:'b'},'fixture');
 const third=await processConversation({messages:[text,editMessage(edit),'Tôi cần giấy tờ gì?'],inputs:second.inputs,profile:'standard',requestId:'c'},'fixture');assert.equal(third.answer.facts.location,'foreign');assert.equal(third.answer.facts.related,true);
});
test('editing cannot merge pending scenarios or supply allocation outside combined funding',async()=>{
 const first='Tôi dự hội thảo ở Hà Nội ngày 15/11/2026, dùng kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
 const a=await processConversation({messages:[first,'Một hội thảo khác ở Nhật Bản.'],profile:'standard',requestId:'a'},'fixture');assert.ok(a.answer.pendingSituation);
 const edit:FactEdit={field:'date',value:'2026-12-20'};await assert.rejects(processConversation({messages:[first,'Một hội thảo khác ở Nhật Bản.',editMessage(edit)],inputs:a.inputs,edit,profile:'standard',requestId:'b'},'fixture'),/tình huống/);
 await assert.rejects(editAll([{field:'allocation',value:true}]),/kết hợp/);
});
