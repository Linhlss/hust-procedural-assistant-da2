import test from 'node:test';
import assert from 'node:assert/strict';
import {z} from 'zod';
import {geminiPatchSchema,groundedGeminiPatch,type GeminiGuard} from '../src/lib/gemini-extraction';
import {advance,converse} from '../src/lib/engine';
import {validateNarrative} from '../src/lib/gemini';
const keep=()=>({action:'keep' as const,value:null,evidence:null});
const blank=():z.input<typeof geminiPatchSchema>=>({intent:'consult',unsupportedTopic:null,facts:{activity:keep(),location:keep(),date:keep(),funding:keep(),related:keep(),allocation:keep()},fundingAction:null,topic:null,requestMode:'unchanged',declined:false,situation:null,pendingSituationAction:null});
test('task money and joint funding do not establish relationship or allocation',()=>{
 const p=blank();p.facts.related={action:'set',value:true,evidence:'kinh phí nhiệm vụ'};p.facts.allocation={action:'set',value:true,evidence:'hai nguồn cùng chi'};const guards:GeminiGuard[]=[];
 const out=groundedGeminiPatch(p,'Tôi dùng kinh phí nhiệm vụ và đơn vị; hai nguồn cùng chi.',{},g=>guards.push(g));assert.equal(out.related,undefined);assert.equal(out.allocation,undefined);assert.equal(guards.length,2);
});
test('changing funding cannot withdraw relationship using the funding phrase as evidence',()=>{
 const p=blank();p.facts.funding={action:'set',value:'unit',evidence:'đơn vị chi toàn bộ'};p.facts.related={action:'clear',value:null,evidence:'không dùng tiền nhiệm vụ nữa'};p.fundingAction='replace';
 const out=groundedGeminiPatch(p,'Đơn vị chi toàn bộ, không dùng tiền nhiệm vụ nữa.');const before=advance(undefined,{intent:'consult',funding:'task',related:true},1,'standard','fixture');assert.equal(advance(before,out,2,'standard','fixture').facts.related,true);assert.equal(out.funding,'unit');
});
test('withdrawal is unknown, while negative relationship and short answers remain false',()=>{
 const p=blank();p.facts.related={action:'clear',value:null,evidence:'rút lại thông tin phục vụ nhiệm vụ'};assert.deepEqual(groundedGeminiPatch(p,'Tôi rút lại thông tin phục vụ nhiệm vụ.').clear,['related']);
 p.facts.related={action:'set',value:false,evidence:'Không liên quan đến đề tài'};assert.equal(groundedGeminiPatch(p,'Không liên quan đến đề tài.').related,false);
 p.facts.related={action:'set',value:false,evidence:'Không'};assert.equal(groundedGeminiPatch(p,'Không.',{clarification:'related'}).related,false);
});
test('invalid date clears only date; mismatched and unstated years cannot be added',()=>{
 const p=blank();p.facts.date={action:'set',value:'2027-02-31',evidence:'31/02/2027'};const out=groundedGeminiPatch(p,'Đổi thành 31/02/2027.');assert.equal(out.date,undefined);assert.deepEqual(out.clear,['date']);
 p.facts.date={action:'set',value:'2027-02-18',evidence:'18/02'};assert.equal(groundedGeminiPatch(p,'Đi ngày 18/02.').date,undefined);
 p.facts.date={action:'set',value:'2025-11-15',evidence:'sửa năm thành 2025'};assert.equal(groundedGeminiPatch(p,'Tôi sửa năm thành 2025.',{previousFacts:{date:'2026-11-15'}}).date,'2025-11-15');
});
test('new-situation declarations survive the automatic reset and preparation purpose avoids extra eligibility questions',()=>{
 const p=blank();p.situation='new';p.facts.activity={action:'set',value:'conference',evidence:'hội thảo'};p.facts.location={action:'set',value:'foreign',evidence:'tại Kuala Lumpur'};
 const out=groundedGeminiPatch(p,'Bỏ chuyến cũ; hỏi trường hợp mới: hội thảo tại Kuala Lumpur.');const before=advance(undefined,{intent:'consult',activity:'work',location:'domestic',date:'2026-11-15',funding:'unit'},1,'standard','fixture');const after=advance(before,out,2,'standard','fixture');assert.equal(after.facts.activity,'conference');assert.equal(after.facts.location,'foreign');assert.equal(after.facts.date,undefined);assert.equal(after.facts.funding,undefined);
 const prep=blank();prep.requestMode='preparation';prep.topic='steps';assert.equal(groundedGeminiPatch(prep,'Sau khi về tôi làm bước nào tiếp?').personal,false);
});
test('valid source ID alone cannot support a document list not present in that paragraph',async()=>{
 const a=await converse(['Hội thảo tại Hà Nội ngày 15/11/2026, chỉ kinh phí đơn vị.']);a.question='Cần làm rõ địa điểm.';
 assert.throws(()=>validateNarrative({paragraphs:[{text:'Cần chuẩn bị giấy mời và kế hoạch tham dự.',sourceIds:['SIM-DV-1']}]},a));
});

test('registering to attend a conference is not research-task registration',()=>{
 const p=blank();p.intent='unsupported';p.unsupportedTopic='registration';p.facts.activity={action:'set',value:'conference',evidence:'tham dự hội thảo'};
 const out=groundedGeminiPatch(p,'Tôi đăng ký tham dự hội thảo.');assert.equal(out.intent,'consult');assert.equal(out.unsupportedTopic,undefined);assert.equal(out.activity,'conference');
});
test('asking about a spending limit is advisory, while asking execution stays outside scope',()=>{
 const p=blank();p.intent='out';p.facts.activity={action:'set',value:'work',evidence:'công tác'};
 assert.equal(groundedGeminiPatch(p,'Tôi công tác, mức chi có đúng định mức không?').intent,'consult');
 assert.equal(groundedGeminiPatch(p,'Duyệt giúp tôi công tác và chuyển tiền theo định mức.').intent,'out');
});

test('a written invalid date cannot leave the previous date active even if the model omits the edit',()=>{
 const p=blank();const out=groundedGeminiPatch(p,'Sửa ngày thành 31/04/2027.');
 const before=advance(undefined,{intent:'consult',activity:'work',location:'domestic',date:'2027-04-14',funding:'unit'},1,'standard','fixture');
 assert.equal(advance(before,out,2,'standard','fixture').facts.date,undefined);
});


test('a personal declaration cannot silently become general lookup without an explicit overview request',()=>{
 const p=blank();p.requestMode='general';assert.equal(groundedGeminiPatch(p,'Tôi công tác, tiền nhiệm vụ và đơn vị cùng chi.').personal,true);
 assert.equal(groundedGeminiPatch(p,'Tôi chỉ hỏi tổng quan về công tác.').general,true);
});


test('a single declared task source cannot become combined funding',()=>{
 const p=blank();p.facts.funding={action:'set',value:'combined',evidence:'kinh phí nhiệm vụ'};p.fundingAction='combine';
 assert.throws(()=>groundedGeminiPatch(p,'Hội thảo dùng kinh phí nhiệm vụ và phục vụ nhiệm vụ.'),/funding_contradicts/);
});
test('explicit exclusive source and negation are checked without replacing model extraction',()=>{
 const p=blank();p.facts.funding={action:'set',value:'combined',evidence:'chỉ dùng kinh phí đơn vị'};
 assert.throws(()=>groundedGeminiPatch(p,'Tôi chỉ dùng kinh phí đơn vị, không dùng kinh phí nhiệm vụ.'),/funding_contradicts/);
 p.facts.funding={action:'set',value:'unit',evidence:'chỉ dùng kinh phí đơn vị'};assert.equal(groundedGeminiPatch(p,'Tôi chỉ dùng kinh phí đơn vị, không dùng kinh phí nhiệm vụ.').funding,'unit');
});
test('invalidating date during a source query suspends dated guidance and asks date',async()=>{
 const a=await converse(['Tôi công tác tại Osaka ngày 07/08/2027, kinh phí đơn vị.','Sửa ngày thành 31/11/2025, căn cứ có thay đổi không?']);
 assert.equal(a.facts.date,undefined);assert.equal(a.clarification?.field,'date');assert.ok(!a.conclusions.some(c=>c.id==='preparation'));assert.ok(!a.conclusions.flatMap(c=>c.sources).some(s=>s.id.startsWith('SIM-CT-')));
});


test('explicit overview after withdrawing a date does not force a date-specific consultation',async()=>{
 const before=await converse(['Tôi công tác ở Hà Nội ngày 20/11/2026, kinh phí đơn vị.']);
 const after=advance(before,{intent:'consult',clear:['date'],ambiguous:true,topic:'documents',general:true,personal:false},2,'standard','fixture');
 assert.equal(after.question,undefined);assert.equal(after.facts.date,undefined);
});


test('withdrawing a fact cannot silently turn the request into source browsing',()=>{
 const p=blank();p.topic='sources';p.requestMode='eligibility';p.facts.related={action:'clear',value:null,evidence:'rút lại thông tin phục vụ nhiệm vụ'};
 const out=groundedGeminiPatch(p,'Tôi rút lại thông tin phục vụ nhiệm vụ.');assert.equal(out.topic,undefined);
 const before=advance(undefined,{intent:'consult',activity:'conference',location:'domestic',date:'2027-11-12',funding:'combined',related:false,allocation:true},1,'standard','fixture');
 assert.equal(advance(before,out,2,'standard','fixture').clarification?.field,'related');
 p.facts.related={action:'clear',value:null,evidence:'rút lại thông tin phục vụ nhiệm vụ'};assert.equal(groundedGeminiPatch(p,'Tôi rút lại thông tin phục vụ nhiệm vụ; căn cứ nào áp dụng?').topic,'sources');
});
