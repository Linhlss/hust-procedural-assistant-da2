import {z} from 'zod';
import {isValidDate} from './input-schema';
import {normalize} from './language';
const nonempty=z.string().trim().min(1);
const date=z.string().refine(isValidDate,'Ngày ISO không hợp lệ');
const permission=z.object({state:z.enum(['unknown','allowed','denied']),evidence:nonempty.nullable()}).strict().superRefine((p,c)=>{
 if(p.state!=='unknown'&&!p.evidence)c.addIssue({code:'custom',message:'Quyền được cho/từ chối phải có bằng chứng'});
});
const section=z.object({id:nonempty,sourceId:nonempty,title:nonempty,text:nonempty,reviewed:z.boolean(),location:z.object({page:z.number().int().positive().nullable(),heading:nonempty.nullable()}).strict()}).strict().superRefine((s,c)=>{
 if(!s.location.page&&!s.location.heading)c.addIssue({code:'custom',message:'Thiếu vị trí điều/trang'});
});
const document=z.object({
 id:nonempty,title:nonempty,domain:z.enum(['KHCN','TCKH','TCNS']),version:nonempty.nullable(),
 sourceStatus:z.enum(['synthetic_fixture','unverified_original','verified_original']),
 originalRef:nonempty.nullable(),
 dates:z.object({from:date.nullable(),to:date.nullable(),verified:z.boolean(),evidence:nonempty.nullable()}).strict(),
 applicability:z.object({cards:z.array(z.enum(['T1','T3','T4','T6','T10'])),funding:z.array(z.enum(['task','unit','combined'])),subjects:z.array(nonempty),taskTypes:z.array(nonempty),units:z.array(nonempty),verified:z.boolean(),evidence:nonempty.nullable()}).strict(),
 permissions:z.object({research:permission,quotation:permission,model:permission,public:permission}).strict(),
 sections:z.array(section).min(1),
}).strict().superRefine((d,c)=>{
 if(d.dates.from&&d.dates.to&&d.dates.from>d.dates.to)c.addIssue({code:'custom',message:'Khoảng ngày bị đảo'});
 if(d.dates.verified&&(!d.dates.from||!d.dates.evidence))c.addIssue({code:'custom',message:'Thiếu căn cứ xác minh hiệu lực'});
 if(d.applicability.verified&&(!d.applicability.cards.length||!d.applicability.evidence))c.addIssue({code:'custom',message:'Thiếu căn cứ xác minh phạm vi'});
});
export const knowledgePackSchema=z.object({
 schemaVersion:z.literal(1),id:nonempty,version:nonempty,kind:z.enum(['synthetic_fixture','provided_document']),
 documents:z.array(document),
 adviceCards:z.array(z.object({id:nonempty,card:z.enum(['T1','T3','T4','T6','T10']),question:nonempty,factFields:z.array(nonempty),sourceIds:z.array(nonempty).min(1),guidance:nonempty.nullable(),stopRule:nonempty,verification:z.enum(['pending','confirmed']),confirmationEvidence:nonempty.nullable()}).strict()),
}).strict().superRefine((p,c)=>{
 const ids=new Set<string>(),sources=new Set<string>(),advice=new Set<string>();
 for(const d of p.documents){
  if(ids.has(d.id))c.addIssue({code:'custom',message:'Trùng mã tài liệu: '+d.id});ids.add(d.id);
  if(p.kind==='provided_document'&&d.sourceStatus==='synthetic_fixture'||p.kind==='synthetic_fixture'&&d.sourceStatus!=='synthetic_fixture')c.addIssue({code:'custom',message:'Lẫn nguồn mẫu và nguồn được cung cấp'});
  const fragments=new Set<string>();
  for(const s of d.sections){
   if(sources.has(s.sourceId))c.addIssue({code:'custom',message:'Trùng mã đoạn: '+s.sourceId});
   if(fragments.has(s.id))c.addIssue({code:'custom',message:'Trùng vị trí đoạn trong tài liệu: '+s.id});
   if(p.kind==='provided_document'&&s.sourceId.startsWith('SIM-'))c.addIssue({code:'custom',message:'Nguồn được cung cấp không được dùng mã SIM'});
   sources.add(s.sourceId);fragments.add(s.id);
  }
 }
 for(const a of p.adviceCards){
  if(advice.has(a.id))c.addIssue({code:'custom',message:'Trùng mã thẻ tư vấn: '+a.id});advice.add(a.id);
  for(const id of a.sourceIds)if(!sources.has(id))c.addIssue({code:'custom',message:'Thẻ dẫn đoạn không tồn tại: '+id});
  if(a.verification==='confirmed'&&(!a.guidance||!a.confirmationEvidence))c.addIssue({code:'custom',message:'Thẻ xác nhận thiếu hướng dẫn/bằng chứng'});
 }
});
export type KnowledgePack=z.infer<typeof knowledgePackSchema>;
export type KnowledgeUse='research'|'quotation'|'model'|'public';
export function packReadiness(pack:KnowledgePack,use:KnowledgeUse){
 const issues:string[]=[];
 if(!pack.documents.length)issues.push('Chưa nhận tài liệu');
 if(!pack.adviceCards.length)issues.push('Chưa có thẻ tư vấn được đối chiếu');
 for(const d of pack.documents){
  if(d.permissions[use].state!=='allowed')issues.push(d.id+': chưa có quyền '+use);
  if(use==='public'&&d.permissions.quotation.state!=='allowed')issues.push(d.id+': chưa có quyền trích dẫn công khai');
  if(pack.kind==='provided_document'&&d.sourceStatus!=='verified_original')issues.push(d.id+': bản gốc chưa xác minh');
  if(pack.kind==='provided_document'&&!d.originalRef)issues.push(d.id+': thiếu liên kết bản gốc');
  if(!d.version)issues.push(d.id+': chưa rõ phiên bản');
  if(!d.dates.verified)issues.push(d.id+': chưa xác minh mốc áp dụng');
  if(!d.applicability.verified)issues.push(d.id+': chưa xác minh phạm vi');
  for(const s of d.sections)if(!s.reviewed)issues.push(s.sourceId+': đoạn chưa soát với bản gốc');
 }
 for(const a of pack.adviceCards)if(a.verification!=='confirmed')issues.push(a.id+': hướng dẫn chờ xác nhận');
 return {ready:issues.length===0,issues};
}
export type RetrievalQuery={text:string;date?:string;card?:'T1'|'T3'|'T4'|'T6'|'T10';domain?:'KHCN'|'TCKH'|'TCNS';funding?:'task'|'unit'|'combined';subject?:string;taskType?:string;unit?:string;use?:KnowledgeUse;limit?:number};
export function retrieveSections(pack:KnowledgePack,q:RetrievalQuery){
 if(q.date&&!isValidDate(q.date))throw new Error('Ngày sự việc không hợp lệ');
 if(!q.text.trim())throw new Error('Câu tìm kiếm trống');
 const stop=new Set(['toi','em','minh','la','va','cua','cho','thi','the','nao','duoc','co','can','nhung','gi','tai','ve']);
 const terms=[...new Set(normalize(q.text).replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(t=>t&&!stop.has(t)))];
 const excluded:{documentId:string;reason:string}[]=[],found:{sourceId:string;documentId:string;title:string;quote:string;version:string|null;from:string|null;to:string|null;location:KnowledgePack['documents'][number]['sections'][number]['location'];score:number;applicabilityVerified:boolean}[]=[];
 for(const d of pack.documents){
  let reason='';
  if(d.permissions[q.use??'research'].state!=='allowed')reason='Chưa có quyền sử dụng';
  else if(q.use==='public'&&d.permissions.quotation.state!=='allowed')reason='Chưa có quyền trích dẫn công khai';
  else if((q.use==='model'||q.use==='public')&&(d.sourceStatus==='unverified_original'||!d.applicability.verified||!d.dates.verified||!d.version))reason='Nguồn chưa đủ xác minh cho mục đích này';
  else if(q.domain&&d.domain!==q.domain)reason='Khác miền nội dung';
  else if(q.card&&!d.applicability.cards.includes(q.card))reason='Khác/thiếu phạm vi thủ tục';
  else if(q.funding&&!d.applicability.funding.includes(q.funding))reason='Khác/thiếu phạm vi kinh phí';
  else if(q.subject&&!d.applicability.subjects.includes(q.subject)||q.taskType&&!d.applicability.taskTypes.includes(q.taskType)||q.unit&&!d.applicability.units.includes(q.unit))reason='Khác/thiếu phạm vi đối tượng hoặc đơn vị';
  else if(q.date&&(!d.dates.verified||!d.dates.from))reason='Chưa xác minh thời điểm áp dụng';
  else if(q.date&&(d.dates.from!>q.date||d.dates.to!==null&&d.dates.to<q.date))reason='Ngoài khoảng áp dụng';
  if(reason){excluded.push({documentId:d.id,reason});continue;}
  for(const section of d.sections){
   if(!section.reviewed){excluded.push({documentId:d.id,reason:section.sourceId+': đoạn chưa soát'});continue;}
   const heading=normalize(d.title+' '+section.title),text=normalize(section.text);
   const score=terms.reduce((n,t)=>n+(heading.includes(t)?3:0)+(text.includes(t)?1:0),0);
   if(score>0)found.push({sourceId:section.sourceId,documentId:d.id,title:d.title,quote:section.text,version:d.version,from:d.dates.from,to:d.dates.to,location:section.location,score,applicabilityVerified:d.applicability.verified});
  }
 }
 return {knowledge:{id:pack.id,version:pack.version,kind:pack.kind},results:found.sort((a,b)=>b.score-a.score||a.sourceId.localeCompare(b.sourceId)).slice(0,Math.max(1,Math.min(q.limit??5,20))),excluded,policyConclusion:false as const};
}
