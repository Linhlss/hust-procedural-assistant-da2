import {test} from 'node:test';
import assert from 'node:assert/strict';
import {converse} from '../src/lib/engine';
import {processConversation,replayRecordedInputs} from '../src/lib/conversation-inputs';
import {answerSummary} from '../src/lib/answer-presentation';
import {freshConversation,appendTurn,saveConversation,readHistory} from '../src/lib/history';
import {fixtureKnowledge,activeKnowledge,KnowledgeConfigurationError} from '../src/lib/knowledge-meta';
import {replaySavedCases} from '../src/lib/replay-evaluation';
const full='Tôi dự hội thảo ở Hà Nội ngày 20/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
test('main narrative is copied once while facts, statuses, changes and citation metadata remain',async()=>{
 const a=await converse([full]);
 const text='Trước khi đi: giữ giấy mời và kế hoạch theo phần hướng dẫn.';
 a.narrative={model:'recorded-test',paragraphs:[{text,sourceIds:['SIM-HD-DOCS']}]};
 a.summary+='\nDiễn giải Gemini:\n'+text;
 const summary=answerSummary(a);
 assert.equal(summary.split(text).length-1,1);
 assert.ok(!summary.includes('Diễn giải Gemini:'));
 assert.ok(summary.includes('Đáp ứng theo khai báo'));
 assert.ok(summary.includes('SIM-HD-DOCS'));assert.ok(summary.includes('Nguồn kinh phí:'));
 assert.equal(answerSummary({...a,narrative:undefined}),a.summary);
});
test('legacy history gains explicit fixture knowledge without erasing existing dialogue',async()=>{
 const a=await converse([full]);delete a.knowledge;
 const chat=appendTurn(freshConversation('standard','legacy',Date.now()),{user:full,answer:a});
 const data=new Map<string,string>(),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};
 saveConversation(storage,chat);
 const read=readHistory(storage)[0];
 assert.deepEqual(read.turns[0].answer.knowledge,fixtureKnowledge);assert.equal(read.turns[0].user,full);
});
test('an unreviewed selected pack fails before any model/network call',async()=>{
 const old=process.env.HUST_KNOWLEDGE_PACK,fetch=globalThis.fetch;let calls=0;
 try{
  process.env.HUST_KNOWLEDGE_PACK='received-unreviewed';
  globalThis.fetch=async()=>{calls++;throw new Error('unexpected');};
  await assert.rejects(processConversation({messages:[full],profile:'standard',requestId:'source-gate'},'gemini'),KnowledgeConfigurationError);
  assert.equal(calls,0);
 }finally{globalThis.fetch=fetch;if(old===undefined)delete process.env.HUST_KNOWLEDGE_PACK;else process.env.HUST_KNOWLEDGE_PACK=old;}
 assert.deepEqual(activeKnowledge('t6-fixture'),fixtureKnowledge);
});
test('offline replay reconstructs source replacement and distinguishes unknown from false without network',async()=>{
 const first=await processConversation({messages:[full],profile:'standard',requestId:'one'},'fixture');
 const messages=[full,'Tôi đổi hoàn toàn sang kinh phí đơn vị.'];
 const next=await processConversation({messages,inputs:first.inputs,profile:'standard',requestId:'two'},'fixture');
 const fetch=globalThis.fetch;globalThis.fetch=async()=>{throw new Error('No network in offline replay');};
 try{
  const replay=await replayRecordedInputs(messages,next.inputs);
  assert.deepEqual(replay.facts,next.answer.facts);
  assert.deepEqual(replay.conclusions,next.answer.conclusions);
  assert.equal(replay.facts.related,true);
  assert.ok(replay.conclusions.every(c=>c.sources.every(s=>s.id!=='SIM-NV-1')));
 }finally{globalThis.fetch=fetch;}
});
test('saved errors remain not replayable instead of becoming synthetic model successes',async()=>{
 const report=await replaySavedCases([{id:'M01',turns:[{turn:1,text:full,expected:{},error:{status:503,body:{code:'GEMINI_SCHEMA',detail:'must-not-copy-provider-body'}}}]}]);
 assert.equal(report.summary.notReplayable,1);assert.equal(report.summary.recordedResponses,0);
 assert.equal(report.modelCalls,0);assert.equal(report.modelQualityReevaluated,false);
 assert.deepEqual(report.rows[0].originalError,{status:503,code:'GEMINI_SCHEMA',skipped:false});
 assert.ok(!JSON.stringify(report).includes('must-not-copy-provider-body'));
});
test('recorded diagnostics accept authorized contact wording but still block fabricated department and money',async()=>{
 const r=await processConversation({messages:['Tôi công tác tại Lào Cai ngày 08/10/2027 bằng kinh phí đơn vị. Giá phòng 2,4 triệu đồng một đêm có được hỗ trợ theo định mức không?'],profile:'missing-unit',requestId:'diagnostic'},'fixture');
 const {validateNarrative}=await import('../src/lib/gemini');
 const allowed='Các đoạn nguồn hiện có chưa quy định mức chi hoặc mức hỗ trợ cho khoản đang hỏi; chưa đủ căn cứ xác định khoản tiền phù hợp. Bạn cần trao đổi với đầu mối tài chính đơn vị hoặc TCKH để đối chiếu định mức, nguồn kinh phí và chứng từ áp dụng.';
 assert.doesNotThrow(()=>validateNarrative({paragraphs:[{text:allowed,sourceIds:[]}]},r.answer));
 assert.doesNotThrow(()=>validateNarrative({paragraphs:[{text:'Bạn cần liên hệ Ban Tài chính–Kế hoạch để xác minh mức chi.',sourceIds:[]}]},r.answer));
 assert.throws(()=>validateNarrative({paragraphs:[{text:'Bạn cần liên hệ Ban Tài chính–Kế hoạch và chuẩn bị kế hoạch.',sourceIds:[]}]},r.answer));
 assert.doesNotThrow(()=>validateNarrative({paragraphs:[{text:'Bạn cho biết đã có hóa đơn. Các đoạn nguồn hiện có chưa đủ căn cứ xác nhận mức chi.',sourceIds:[]}]},r.answer));
 for(const text of ['Bạn cần trao đổi với phòng Tài chính - Kế hoạch.','Bạn được hỗ trợ tối đa 2,4 triệu đồng.','Bạn phải nộp hóa đơn và bảng kê.']){
  assert.throws(()=>validateNarrative({paragraphs:[{text,sourceIds:[]}]},r.answer));
 }
});

test('model failure diagnostics separate service, extraction and output validation without raw data',async()=>{
 const {geminiExtract,validateNarrative}=await import('../src/lib/gemini');
 const oldFetch=globalThis.fetch,oldKey=process.env.GEMINI_API_KEY;
 try{
  process.env.GEMINI_API_KEY='unit-test-placeholder';
  globalThis.fetch=async()=>new Response(JSON.stringify({error:{status:'RESOURCE_EXHAUSTED',message:'quota test'}}),{status:429});
  await assert.rejects(geminiExtract(['Tôi dự hội thảo.']),e=>{const x=e as {code:string;diagnostic:unknown};assert.equal(x.code,'GEMINI_QUOTA');assert.deepEqual(x.diagnostic,{phase:'extract',kind:'service'});return true;});
  const a=await converse([full]);
  assert.throws(()=>validateNarrative({paragraphs:[{text:'Được hỗ trợ 999 triệu đồng.',sourceIds:[]}]},a),e=>{
   const x=e as {diagnostic:{phase:string;kind:string;reason:string}};
   assert.equal(x.diagnostic.phase,'compose');assert.equal(x.diagnostic.kind,'output_validation');assert.equal(x.diagnostic.reason,'unsupported_number');return true;
  });
 }finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;}
});
