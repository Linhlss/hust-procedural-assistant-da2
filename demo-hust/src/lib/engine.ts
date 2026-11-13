import type { Answer, Conclusion, Facts, Patch, Revision, Source, Profile, Clarification, ChatMode } from './types';
import { applicable, sourceById } from './sources';
import {fixtureKnowledge} from './knowledge-meta';
import { fixtureAdapter, type Extractor } from './extractor';
export { labels, factValue } from './presentation';
import { nextClarification,shortReply } from './clarification';
import { labels, factValue } from './presentation';
import { situationSignals,unsupportedLabels,fundingPatch } from './language';
const disclaimer='Theo bộ tài liệu mẫu · chưa thay thế hướng dẫn chính thức.';
function evaluate(f:Facts,profile:Profile,pending:boolean,awaitingDate=false):Conclusion[]{
 const out:Conclusion[]=[];
 const add=(id:string,group:Conclusion['group'],title:string,status:Conclusion['status'],text:string,facts:(keyof Facts)[],sources:Source[],next:string,reason:string)=>out.push({id,group,title,status,text,facts,sources,next,reason});
 const task=applicable('SIM-NV-1',f.date,profile),common=applicable(f.date&&f.date<'2026-01-01'?'SIM-CT-2025':'SIM-CT-2026',f.date,profile),unit=applicable('SIM-DV-1',f.date,profile);
 if(f.funding){
  const scope=f.funding==='task'?'Đối chiếu phần kinh phí nhiệm vụ cùng hướng dẫn hội thảo, công tác chung.':f.funding==='unit'?'Áp dụng hướng dẫn nguồn đơn vị và phần công tác chung; điều kiện riêng của kinh phí nhiệm vụ không còn áp dụng.':'Đối chiếu riêng nguồn nhiệm vụ, nguồn đơn vị và phần hướng dẫn chung.';
  add('scope','KL1','Phạm vi nguồn đang xét','scope',scope,['funding'],f.funding==='unit'?(unit?[unit]:[]):task?[task]:[],'Xem điều kiện và hướng dẫn chuẩn bị tương ứng bên dưới.','Chọn nguồn theo kinh phí khai báo, không suy ra quyền được chi.');
 }
 if(!pending&&f.funding&&f.funding!=='unit'&&f.date){
  if(!task)add('task','KL1','Điều kiện liên hệ nhiệm vụ','insufficient','Chưa có phiên bản tài liệu nhiệm vụ bao phủ thời điểm này.',['date','funding'],[],'Xác minh phiên bản với đầu mối KHCN.','Không dùng phiên bản ngoài khoảng áp dụng.');
  else if(f.related===undefined)add('task','KL1','Điều kiện liên hệ nhiệm vụ','insufficient','Cần làm rõ hoạt động có phục vụ nhiệm vụ hay không.',['funding','related'],[task],'Bổ sung quan hệ giữa hoạt động với nhiệm vụ.','Điều kiện về quan hệ nhiệm vụ phụ thuộc khai báo này.');
  else add('task','KL1','Điều kiện liên hệ nhiệm vụ',f.related?'meets':'fails',f.related?'Hoạt động có phục vụ nhiệm vụ, đáp ứng điều kiện liên hệ theo khai báo.':'Hoạt động không phục vụ nhiệm vụ, nên không đáp ứng điều kiện liên hệ theo khai báo.',['funding','related','date'],[task],'Trao đổi với đầu mối KHCN về nội dung gắn với nhiệm vụ.','Đối chiếu quan hệ phục vụ nhiệm vụ tại mục 1.');
 }
 if(f.activity&&awaitingDate)add('common','KL2','Điều kiện địa điểm chung','insufficient','Ngày hoạt động vừa sửa chưa rõ hoặc không hợp lệ; cần làm rõ trước khi chọn phiên bản.',['date'],[],'Cung cấp lại ngày hoạt động.','Kết luận theo ngày cũ đã tạm dừng.');
 if(f.activity&&f.date){
  if(!common)add('common','KL2','Điều kiện địa điểm chung','insufficient','Chưa có phiên bản hướng dẫn chung bao phủ ngày hoạt động này.',['activity','date'],[],'Xác minh phiên bản với đầu mối TCKH.','Ngày hoạt động nằm ngoài khoảng áp dụng của tài liệu.');
  else if(f.location){
   if(profile==='conflict'&&f.date>='2026-01-01'&&f.location==='domestic')add('common','KL2','Điều kiện địa điểm chung','insufficient','Hai nguồn cùng phạm vi mâu thuẫn. Dừng kết luận điều kiện địa điểm cho đến khi có căn cứ xác định thứ tự ưu tiên.',['location','date'],[common,applicable('SIM-CT-CONFLICT',f.date,profile)!],'Đầu mối TCKH cần xác minh cách xử lý mâu thuẫn.','Không tự ưu tiên một nguồn hoặc yêu cầu người hỏi chọn quy định.');
   else {const meets=f.location==='domestic'||common.id==='SIM-CT-2026';add('common','KL2','Điều kiện địa điểm chung',meets?'meets':'fails',`${meets?'Đáp ứng':'Không đáp ứng'} điều kiện địa điểm theo khai báo và ${common.version.toLowerCase()}.`,['activity','location','date'],[common],'Tiếp tục đối chiếu phần kinh phí và giấy tờ cần chuẩn bị.','Chọn phiên bản theo thời điểm, rồi đối chiếu địa điểm thực tế.');}
  }
 }
 if(pending)add('unit','KL3','Nguồn mới cần làm rõ','insufficient','Chưa rõ nguồn đơn vị thay thế hoàn toàn hay hỗ trợ thêm; tạm dừng phần phụ thuộc thay đổi này.',['funding'],[],'Làm rõ quan hệ hai nguồn kinh phí.','Thiếu dữ kiện về thay thế hoặc kết hợp.');
 else if((f.funding==='unit'||f.funding==='combined')&&f.date){
  if(!unit)add('unit','KL3','Phần hỗ trợ từ đơn vị','insufficient',profile==='missing-unit'?'Bộ kiểm thử này chưa có tài liệu nguồn đơn vị, nên phần điều kiện riêng chưa đủ căn cứ.':'Chưa có phiên bản hướng dẫn nguồn đơn vị cho thời điểm này.',['funding','date'],[],'Xác minh hướng dẫn với đầu mối tài chính đơn vị.','Thiếu nguồn áp dụng; bổ sung dữ kiện không thay được việc xác minh nguồn.');
  else if(f.activity){const combined=f.funding==='combined';const allocation=applicable('SIM-DV-COMBINE',f.date,profile)!;const ready=!combined||f.allocation===true;
   add('unit','KL3','Phần hỗ trợ từ đơn vị',ready?'meets':'insufficient',combined?(ready?'Các nội dung đã được phân định theo từng nguồn, đáp ứng điều kiện kết hợp theo khai báo.':'Nguồn đơn vị có hướng dẫn áp dụng; cần phân định nội dung do từng nguồn hỗ trợ trước khi kết luận điều kiện kết hợp.'):'Hội thảo/công tác thuộc phạm vi hướng dẫn nguồn đơn vị. Bạn có thể chuẩn bị đề xuất sử dụng nguồn này theo tài liệu bên dưới.',['funding','activity','date',...(combined?['allocation' as const]:[])],combined?[unit,allocation]:[unit],'Chuẩn bị giấy mời hoặc chương trình, kế hoạch tham dự và đề xuất sử dụng nguồn đơn vị.','Đối chiếu phạm vi nguồn đơn vị và điều kiện kết hợp nếu có.');
  }
 }
 if(f.activity&&f.date&&f.location&&(task||unit||common))out.push(guidance('documents',f,profile));
 return out;
}
function guidance(topic:NonNullable<Patch['topic']>,f:Facts,profile:Profile='standard'):Conclusion{
 const id=topic==='steps'?'SIM-HD-STEPS':topic==='timing'?'SIM-HD-TIME':'SIM-HD-DOCS';
 const handbook=sourceById(id)!;
 const source=f.date?applicable(id,f.date,profile):handbook;
 const task=f.funding==='task'||f.funding==='combined'?applicable('SIM-NV-PREP',f.date,profile):undefined;
 const unit=f.funding==='unit'||f.funding==='combined'?applicable('SIM-DV-PREP',f.date,profile):undefined;
 const title=topic==='steps'?'Các bước tiếp theo':topic==='timing'?'Thời điểm chuẩn bị':topic==='sources'?'Tài liệu để đối chiếu':'Giấy tờ cần chuẩn bị';
 const missing=Boolean(f.date&&(!source||(f.funding==='task'||f.funding==='combined')&&!task||(f.funding==='unit'||f.funding==='combined')&&!unit));
 const sources=[source,task,unit].filter((s):s is Source=>Boolean(s));
 const funding=f.funding==='task'?'kinh phí nhiệm vụ':f.funding==='unit'?'kinh phí đơn vị':f.funding==='combined'?'hai nguồn nhiệm vụ và đơn vị':undefined;
 let points=topic==='steps'?['Xác định hoạt động, thời gian, địa điểm và nguồn hỗ trợ.','Đối chiếu phần nhiệm vụ nếu dùng kinh phí nhiệm vụ; trao đổi với tài chính đơn vị nếu dùng nguồn đơn vị.','Chuẩn bị giấy tờ tương ứng và giữ chứng từ trong quá trình tham dự.']:topic==='timing'?['Trao đổi về nguồn hỗ trợ và giấy tờ trước ngày hoạt động.','Sau hoạt động, hỏi đầu mối tài chính về thời điểm hoàn thiện; tài liệu mẫu chưa đặt một hạn chót cố định.']:['Trước khi đi: giấy mời hoặc chương trình, kế hoạch ghi thời gian và địa điểm, đề xuất nguồn hỗ trợ.','Sau hoạt động: giữ xác nhận tham dự, chứng từ đăng ký và di chuyển/lưu trú nếu phát sinh.'];
 if(task)points.splice(1,0,topic==='steps'?'Trao đổi với đầu mối KHCN hoặc đơn vị chủ trì về nội dung gắn với nhiệm vụ.':'Bổ sung mô tả hoạt động liên quan đến nhiệm vụ; trao đổi với đầu mối KHCN hoặc đơn vị chủ trì trước khi thực hiện.');
 if(unit)points.splice(1,0,f.funding==='combined'?'Kèm mô tả phần việc tương ứng từng nguồn; trao đổi với đầu mối tài chính đơn vị.':'Chuẩn bị đề xuất sử dụng nguồn đơn vị và trao đổi với đầu mối tài chính đơn vị.');
 if(funding&&topic==='steps')points=points.filter(p=>!p.startsWith('Đối chiếu phần nhiệm vụ'));
 if(!funding&&topic==='documents')points.splice(1,0,'Nếu dùng kinh phí nhiệm vụ: bổ sung mô tả hoạt động liên quan đến nhiệm vụ.');
 if(!source)points=[];
 return {id:'preparation',group:'KL3',title,status:missing?'insufficient':'scope',text:missing?'Chưa đủ nguồn áp dụng để hoàn thiện hướng dẫn cho thời điểm và nguồn kinh phí này. Tôi chỉ giữ phần có căn cứ bên dưới.':funding?`Hướng dẫn chuẩn bị cho ${f.activity==='work'?'chuyến công tác':f.activity==='conference'?'hội thảo':'hoạt động'} dùng ${funding}${f.date?` ngày ${f.date.split('-').reverse().join('/')}`:''}.`:topic==='steps'?'Bạn có thể thực hiện theo trình tự sau.':topic==='timing'?'Bạn nên chuẩn bị trước ngày hoạt động và xác nhận mốc hoàn thiện với đầu mối tài chính.':'Bạn nên chuẩn bị theo các nhóm giấy tờ dưới đây.',points,facts:(['activity','funding','date'] as const).filter(k=>f[k]!==undefined),sources,next:missing?'Xác minh tài liệu theo thời điểm và hướng dẫn của nguồn kinh phí với đầu mối phụ trách. Không dùng dữ kiện cá nhân để thay cho nguồn còn thiếu.':`Trao đổi với ${f.funding==='task'?'đầu mối KHCN hoặc đơn vị chủ trì':'đầu mối tài chính đơn vị'} về danh mục và mốc hoàn thiện; bạn có thể mở tài liệu đầy đủ trong căn cứ.`,reason:'Chọn hướng dẫn chuẩn bị theo hoạt động, nguồn kinh phí và thời điểm; không phải kết quả kiểm tra điều kiện hoặc tiền kiểm hồ sơ.'};
}
export function advance(previous:Answer|undefined, patch:Patch, turn:number, profile:Profile, mode:ChatMode):Answer {
 const old=previous?.facts??{};
 const f:Facts=patch.newSituation?{...previous?.pendingSituation}:patch.sameSituation?{...old,...previous?.pendingSituation}:{...old};
 const changed:string[]=[];
 let pendingSituation=patch.newSituation||patch.sameSituation?undefined:previous?.pendingSituation;
 let pendingSituationAction=patch.newSituation||patch.sameSituation?undefined:previous?.pendingSituationAction;
 if(patch.situationUnclear){pendingSituation={};pendingSituationAction=patch.pendingSituationAction;}
 let pending=patch.newSituation?false:patch.sameSituation&&previous?.pendingSituationAction?previous.pendingSituationAction==='unclear':previous?.pendingFunding??false;
 let declined=patch.newSituation?false:previous?.declined??false;
 if(patch.intent==='consult'){
  const target=pendingSituation??f;
  for(const key of patch.clear??[])delete target[key];
  for(const key of Object.keys(labels) as (keyof Facts)[])if(patch[key]!==undefined)Object.assign(target,{[key]:patch[key]});
  if(pendingSituation){if(patch.pendingSituationAction)pendingSituationAction=patch.pendingSituationAction;}
  else {
   if(patch.fundingAction==='unclear')pending=true;
   else if(patch.fundingAction==='combine'||patch.fundingAction==='replace'||patch.clear?.includes('funding'))pending=false;
   if(old.funding!==f.funding)delete f.allocation;
   if(patch.allocation!==undefined)f.allocation=patch.allocation;
  }
  for(const key of Object.keys(labels) as (keyof Facts)[])if(old[key]!==f[key])changed.push(labels[key]);
  if(patch.declined)declined=true;else if(changed.length||patch.newSituation||patch.sameSituation)declined=false;
 }
 let question:string|undefined;let clarification:Clarification|undefined;
 const topic=patch.topic??(previous?.clarification?previous.requestedTopic:undefined);
 const preparationOnly=previous?.clarification&&!patch.topic?Boolean(previous.preparationOnly):Boolean(topic&&(topic!=='steps'||!patch.personal));
 const dateInvalidated=Boolean(patch.clear?.includes('date')&&!patch.newSituation&&!pendingSituation&&!patch.general);
 const consultation=(!patch.general&&topic!=='sources')||dateInvalidated; let text='Tôi đã đối chiếu hướng dẫn theo tình huống bạn cung cấp.';
 let conclusions=evaluate(f,profile,pending,!f.date&&Boolean(previous?.facts.date||previous?.conclusions.some(c=>c.id==='common')));
 if(patch.intent==='unsupported'){text=`Nội dung ${unsupportedLabels[patch.unsupportedTopic??'extension']} chưa được hỗ trợ trong bản trải nghiệm này. Tôi chưa có bộ nguồn đã chuẩn hóa để tư vấn phần đó. Hiện tôi có thể hướng dẫn hội thảo/công tác T6; bạn có thể hỏi riêng phần này hoặc trao đổi với đầu mối phụ trách nội dung vừa nêu.`;conclusions=[];}
 else if(patch.intent==='out') {text='Yêu cầu này nằm ngoài phạm vi demo. Tôi không phê duyệt, xác nhận khoản chi, tra hồ sơ cá nhân, ghi hệ thống hoặc làm theo yêu cầu bỏ quy tắc. Bạn có thể hỏi hướng dẫn hội thảo/công tác T6.'; conclusions=[];}
 else if(patch.intent==='unknown') {text='Tôi chưa hiểu đủ yêu cầu để tư vấn. Demo hiện hỗ trợ hội thảo/công tác T6. Bạn có thể diễn đạt tình huống và nguồn kinh phí bằng lời của mình.';conclusions=[];}
 else {
  const candidate=nextClarification(f,profile,pending,Boolean(pendingSituation),dateInvalidated?'documents':preparationOnly?topic:undefined);
  if(pendingSituation)conclusions=[];
  else if(topic){conclusions=topic==='sources'||(!preparationOnly&&!patch.general)?[...conclusions.filter(c=>c.id!=='preparation'),guidance(topic,f,profile)]:[guidance(topic,f,profile)];text=patch.general?'Dưới đây là hướng dẫn tổng quan; danh mục cụ thể còn tùy nguồn kinh phí và thời điểm hoạt động.':'Bạn có thể chuẩn bị theo hướng dẫn dưới đây.';}
  if(dateInvalidated)conclusions=conclusions.filter(c=>c.id!=='preparation');
  if(candidate&&consultation&&!declined){clarification=candidate;question=candidate.question;text=previous?.clarification?(changed.length?'Tôi đã ghi nhận thông tin bạn vừa bổ sung. Tiếp theo, tôi cần làm rõ một điểm.':'Tôi chưa xác định được thông tin cho câu hỏi này. Bạn có thể chọn một phương án hoặc diễn đạt rõ hơn.'):'Tôi sẽ hướng dẫn theo tình huống của bạn. Trước hết, mình làm rõ từng thông tin cần thiết.';}
  else if(candidate&&declined)text='Tôi ghi nhận bạn chưa thể cung cấp thêm. Tôi sẽ giữ phần chưa rõ ở mức hướng dẫn có điều kiện, không tự điền dữ kiện thay bạn.';
  else if(!candidate&&consultation)text=preparationOnly?'Đã có thông tin cần thiết để chọn hướng dẫn chuẩn bị cho hoạt động của bạn.':'Thông tin hiện tại đã đủ để đối chiếu các điều kiện trong bộ tài liệu. Dưới đây là hướng dẫn dành cho tình huống của bạn.';
 }
 const revisions:Revision[]=[];
 // Compare with last evaluated guidance even if an intervening turn was outside scope.
 for(const before of previous?.conclusions??[]) {
  const after=(preparationOnly?evaluate(f,profile,pending):conclusions).find(c=>c.id===before.id);
  if(patch.intent==='consult'&&!patch.newSituation&&!pendingSituation&&before.id!=='preparation'&&(!after||JSON.stringify([before.status,before.text,before.sources.map(s=>s.id)])!==JSON.stringify([after.status,after.text,after.sources.map(s=>s.id)]))) revisions.push({id:before.id,title:before.title,before:before.text,after:after?.text??(pending?'Tạm dừng cho đến khi làm rõ quan hệ hai nguồn.':'Không còn áp dụng cho nguồn hiện tại.'),reason:changed.length?`Đã đổi ${changed.join(', ').toLowerCase()}; đã chọn lại nguồn và kiểm các kết luận phụ thuộc.`:'Đã xét lại trạng thái nguồn/dữ kiện cần làm rõ.'});
 }
 const summary=[disclaimer,question?`Cần bổ sung: ${question}`:'',...Object.entries(f).map(([k,v])=>`${labels[k as keyof Facts]}: ${factValue(k as keyof Facts,v)}`),pending?'Nguồn mới đang chờ làm rõ.':'',...conclusions.map(c=>`${c.title}: ${c.text}${c.points?'\n'+c.points.map(p=>`- ${p}`).join('\n'):''}\nCăn cứ: ${c.sources.map(s=>`${s.id}, ${s.paragraph}, ${s.version}, ${s.from} → ${s.to}`).join('; ')||'Chưa có nguồn hỗ trợ phần này'}\nBước tiếp theo: ${c.next}`)].filter(Boolean).join('\n');
 return {knowledge:{...fixtureKnowledge},intent:patch.intent,turn,mode,text,question,facts:f,conclusions,revisions,changed,profile,pendingFunding:pending,summary,sourceLabel:disclaimer,clarification,consultation,pendingSituation,pendingSituationAction,declined,requestedTopic:topic,preparationOnly};
}
export async function converse(messages:string[],profile:Profile='standard',extract:Extractor=fixtureAdapter,mode:ChatMode='fixture',options:{initial?:Answer;lastEvaluated?:Conclusion[];turnOffset?:number;onExtract?:(patch:Patch,index:number)=>void;onEvaluated?:(conclusions:Conclusion[])=>void}={}) {
 let previous:Answer|undefined=options.initial;
 let lastEvaluated:Conclusion[]=options.lastEvaluated??previous?.conclusions??[];
 for(let i=0;i<messages.length;i++) {
  const signals=situationSignals(messages[i]);
  const possibleNew=Boolean(previous?.facts.activity&&(signals.other||!previous.clarification&&signals.freshPersonal&&!signals.correction));
  const extractionFacts=signals.explicitNew||possibleNew?{}:previous?.pendingSituation??previous?.facts??{};
  const extracted=await extract(messages[i],extractionFacts);
  options.onExtract?.(extracted,i);
  const protectedIntent=extracted.intent==='out'||extracted.intent==='unsupported';
  const reply=protectedIntent?{}:shortReply(messages[i],previous?.clarification?.field);
  let patch:Patch=Object.keys(reply).length?{...extracted,...reply,intent:'consult'}:extracted.intent==='unknown'&&previous?.clarification?{...extracted,intent:'consult'}:extracted;
  if(!protectedIntent){
   if(signals.explicitNew||patch.newSituation){patch={...patch,newSituation:true,sameSituation:false,situationUnclear:false,intent:'consult'};}
   else if(signals.same||patch.sameSituation)patch={...patch,sameSituation:true,situationUnclear:false,intent:'consult'};
   else if(possibleNew&&patch.intent==='consult'&&!patch.situationUnclear)patch={...patch,situationUnclear:true,pendingSituationAction:fundingPatch(messages[i],previous?.facts??{}).fundingAction};
  }
  const next=advance(previous?{...previous,conclusions:lastEvaluated}:undefined,patch,(options.turnOffset??0)+i+1,profile,mode);
  if(patch.intent==='consult'&&!next.pendingSituation)lastEvaluated=next.preparationOnly?[...evaluate(next.facts,profile,Boolean(next.pendingFunding)).filter(c=>c.id!=='preparation'),...next.conclusions]:next.conclusions;
  options.onEvaluated?.(lastEvaluated);
  previous=next;
 }
 return previous!;
}
