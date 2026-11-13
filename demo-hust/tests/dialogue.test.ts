import test from 'node:test';
import assert from 'node:assert/strict';
import { converse } from '../src/lib/engine';
import { appendTurn,freshConversation,readHistory,saveConversation,type StorageLike } from '../src/lib/history';
const scenario='tôi đang là 1 giáo viên dạy ở trường, tôi muốn đi hội thảo ở bên KHTC thì cần làm gì';
test('exact screenshot question starts a purposeful, one-at-a-time clarification flow',async()=>{
 const messages=[scenario];let a=await converse(messages);assert.equal(a.clarification?.field,'funding');assert.equal(a.question,a.clarification?.question);assert.equal(a.question?.match(/\?/g)?.length,1);assert.equal(a.facts.location,undefined);
 messages.push('Kinh phí nhiệm vụ');a=await converse(messages);assert.equal(a.clarification?.field,'location');assert.equal(a.facts.funding,'task');
 messages.push('Hà Nội');a=await converse(messages);assert.equal(a.clarification?.field,'date');assert.equal(a.facts.location,'domestic');
 messages.push('Ngày 15/11/2026');a=await converse(messages);assert.equal(a.clarification?.field,'related');assert.doesNotMatch(a.question!,/nguồn kinh phí|địa điểm|ngày nào/);
 messages.push('Có');a=await converse(messages);assert.equal(a.question,undefined);assert.equal(a.clarification,undefined);assert.equal(a.facts.related,true);assert.equal(a.conclusions.find(c=>c.id==='task')!.status,'meets');assert.ok(a.conclusions.find(c=>c.id==='preparation')!.points!.length>=3);
});
test('unit and combined branches skip irrelevant fields and interpret short answers in the asked context',async()=>{
 const base=[scenario,'Chỉ dùng kinh phí đơn vị','Trong nước','15/11/2026'];const unit=await converse(base);assert.equal(unit.question,undefined);assert.ok(!unit.conclusions.some(c=>c.id==='task'));assert.equal(unit.conclusions.find(c=>c.id==='unit')!.status,'meets');
 const both=[scenario,'Kết hợp cả hai nguồn','Trong nước','15/11/2026','Có'];const waiting=await converse(both);assert.equal(waiting.clarification?.field,'allocation');const done=await converse([...both,'Có']);assert.equal(done.facts.related,true);assert.equal(done.facts.allocation,true);assert.equal(done.question,undefined);
 const no=await converse([...both,'Chưa']);assert.equal(no.facts.related,true);assert.equal(no.facts.allocation,false);assert.equal(no.conclusions.find(c=>c.id==='unit')!.status,'insufficient');
});
test('multi-fact responses skip collected fields; invalid dates and unrecognized answers keep the correct next question',async()=>{
 const a=await converse([scenario,'Tôi chỉ dùng kinh phí đơn vị, ở Hà Nội ngày 15/11/2026.']);assert.equal(a.question,undefined);
 const invalid=await converse([scenario,'Chỉ dùng kinh phí đơn vị','Trong nước','31/02/2026']);assert.equal(invalid.facts.date,undefined);assert.equal(invalid.clarification?.field,'date');
 const unclear=await converse([scenario,'ừm']);assert.equal(unclear.clarification?.field,'funding');assert.match(unclear.text,/chưa xác định/);
});
test('pure information requests stay direct; topic navigation is not a replaced business conclusion',async()=>{
 const a=await converse(['Tôi chỉ muốn biết tổng quan: hội thảo cần những giấy tờ gì?']);assert.equal(a.clarification,undefined);assert.equal(a.question,undefined);assert.ok(a.conclusions.some(c=>c.points?.length));
 const b=await converse(['Tôi chỉ muốn biết tổng quan: hội thảo cần những giấy tờ gì?','Tôi chỉ muốn biết tổng quan: các bước thực hiện như thế nào?']);assert.ok(!b.revisions.some(r=>r.id==='preparation'));
 const full=await converse(['Hội thảo ở Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.']);assert.equal(full.question,undefined);
});
test('declining stops the follow-up loop, while missing source is not treated as a user fact to collect',async()=>{
 const a=await converse([scenario,'Tôi chưa biết và không muốn cung cấp thêm']);assert.equal(a.question,undefined);assert.ok(a.declined);
 const b=await converse(['Hội thảo tại Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.','Đơn vị hỗ trợ thêm, kết hợp cả hai nguồn.'],'missing-unit');assert.equal(b.question,undefined);assert.equal(b.conclusions.find(c=>c.id==='unit')!.status,'insufficient');
});
test('saved histories preserve the pending question and resume correctly',async()=>{const map=new Map<string,string>();const store:StorageLike={getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v);},removeItem:k=>{map.delete(k);}};const a=await converse([scenario]);saveConversation(store,appendTurn(freshConversation(),{user:scenario,answer:a}));const saved=readHistory(store)[0];assert.equal(saved.turns[0].answer.clarification?.field,'funding');const b=await converse([...saved.turns.map(t=>t.user),'Chỉ dùng kinh phí đơn vị']);assert.equal(b.clarification?.field,'location');});
test('a fresh personal scenario after a complete case does not silently inherit old facts',async()=>{const full='Hội thảo tại Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';const a=await converse([full,scenario]);assert.equal(a.clarification?.field,'situationRelation');const b=await converse([full,scenario,'Đây là một tình huống mới.']);assert.equal(b.clarification?.field,'funding');assert.equal(b.facts.date,undefined);assert.equal(b.facts.funding,undefined);assert.equal(b.facts.location,undefined);const c=await converse([full,scenario,'Tôi tiếp tục tình huống trước.']);assert.equal(c.question,undefined);assert.equal(c.facts.date,'2026-11-15');});
