import test from 'node:test';
import assert from 'node:assert/strict';
import { converse } from '../src/lib/engine';
import { appendTurn,freshConversation,readHistory,saveConversation,type StorageLike } from '../src/lib/history';
test('screenshot preparation question asks for its decision-making facts and keeps the original goal through replies',async()=>{
 const messages=['Tham dự hội thảo cần chuẩn bị những giấy tờ gì?'];let a=await converse(messages);assert.equal(a.clarification?.field,'funding');assert.equal(a.requestedTopic,'documents');assert.equal(a.preparationOnly,true);
 messages.push('Chỉ dùng kinh phí đơn vị');a=await converse(messages);assert.equal(a.clarification?.field,'date');assert.ok(!a.clarification?.remaining.some(k=>k==='location'||k==='related'));
 messages.push('15/11/2026');a=await converse(messages);assert.equal(a.question,undefined);assert.equal(a.conclusions.length,1);const c=a.conclusions[0];assert.equal(c.id,'preparation');assert.ok(c.sources.some(s=>s.id==='SIM-DV-PREP'));assert.ok(!c.sources.some(s=>s.id.startsWith('SIM-NV')));assert.match(c.text,/kinh phí đơn vị.*15\/11\/2026/);assert.match(c.points!.join(' '),/đề xuất sử dụng nguồn đơn vị/);assert.doesNotMatch(c.points!.join(' '),/mô tả hoạt động liên quan đến nhiệm vụ/);
});
test('all welcome examples ask only their missing required information; complete requests do not ask again',async()=>{
 const first=await converse(['Tôi là giảng viên, muốn tham dự hội thảo và cần biết nên làm gì.']);assert.equal(first.clarification?.field,'funding');
 const second=await converse(['Tôi sắp đi công tác bằng kinh phí đơn vị. Tôi cần chuẩn bị gì?']);assert.equal(second.clarification?.field,'date');assert.deepEqual(second.clarification?.remaining,['date']);
 const ready=await converse(['Tôi đi công tác bằng kinh phí đơn vị ngày 20/11/2026. Tôi cần chuẩn bị gì?']);assert.equal(ready.question,undefined);assert.ok(ready.conclusions[0].sources.some(s=>s.id==='SIM-DV-PREP'));
});
test('steps and timing remain the requested output after clarification, without demanding unrelated eligibility facts',async()=>{
 for(const [text,title,id] of [['Các bước đi công tác như thế nào?','Các bước tiếp theo','SIM-HD-STEPS'],['Đi hội thảo cần chuẩn bị trước bao lâu?','Thời điểm chuẩn bị','SIM-HD-TIME']]){
  const a=await converse([text,'Kinh phí nhiệm vụ','15/11/2026']);assert.equal(a.question,undefined);assert.equal(a.conclusions[0].title,title);assert.ok(a.conclusions[0].sources.some(s=>s.id===id));assert.ok(a.conclusions[0].sources.some(s=>s.id==='SIM-NV-PREP'));assert.equal(a.facts.location,undefined);assert.equal(a.facts.related,undefined);assert.ok(!a.conclusions.some(c=>c.status==='meets'));
 }
});
test('missing or out-of-period preparation sources stop the affected branch rather than asking eligibility questions',async()=>{
 const missing=await converse(['Hội thảo bằng nguồn đơn vị ngày 15/11/2026 cần giấy tờ gì?'],'missing-unit');assert.equal(missing.question,undefined);assert.equal(missing.conclusions[0].status,'insufficient');assert.ok(!missing.conclusions[0].sources.some(s=>s.id.startsWith('SIM-DV')));
 const old=await converse(['Hội thảo bằng kinh phí nhiệm vụ ngày 15/11/2020 cần giấy tờ gì?']);assert.equal(old.question,undefined);assert.equal(old.conclusions[0].status,'insufficient');assert.deepEqual(old.conclusions[0].sources,[]);assert.deepEqual(old.conclusions[0].points,[]);
});
test('explicit overview and document-library requests remain direct; declining clarification does not fabricate facts',async()=>{
 const overview=await converse(['Tôi chỉ muốn biết tổng quan: hội thảo cần giấy tờ gì?']);assert.equal(overview.question,undefined);assert.match(overview.text,/tổng quan/);
 const sources=await converse(['Các tài liệu hội thảo để đối chiếu?']);assert.equal(sources.question,undefined);
 const declined=await converse(['Hội thảo cần giấy tờ gì?','Tôi chưa biết và không muốn cung cấp thêm']);assert.equal(declined.question,undefined);assert.equal(declined.facts.funding,undefined);assert.ok(declined.declined);
});
test('saved preparation questions retain their topic and resume from raw user history',async()=>{
 const question='Đi hội thảo cần chuẩn bị trước bao lâu?';const a=await converse([question]);const map=new Map<string,string>();const store:StorageLike={getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v);},removeItem:k=>{map.delete(k);}};saveConversation(store,appendTurn(freshConversation(),{user:question,answer:a}));const saved=readHistory(store)[0];assert.equal(saved.turns[0].answer.requestedTopic,'timing');assert.equal(saved.turns[0].answer.preparationOnly,true);const done=await converse([...saved.turns.map(t=>t.user),'Kinh phí đơn vị ngày 15/11/2026']);assert.equal(done.question,undefined);assert.equal(done.conclusions[0].title,'Thời điểm chuẩn bị');
});
