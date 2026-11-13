import type { Source, Profile } from './types';
import { documents } from './documents';
export const sources:Source[]=documents.flatMap(doc=>doc.sections.map(section=>({id:section.sourceId,title:doc.title,domain:doc.domain,version:doc.version,from:doc.from,to:doc.to,paragraph:section.title,quote:section.text,documentId:doc.id,fragment:section.id,provenance:'synthetic_fixture',publication:'demo_generated',owner:null})));
export const card={id:'T6',name:'Hội thảo & công tác',case:'CA-01',domains:['KHCN','TCKH'],owner:null,verification:'synthetic_fixture',excludes:['Phê duyệt hồ sơ','Xác nhận khoản chi','Ghi hệ thống HUST'],profiles:{standard:'Đầy đủ tài liệu mẫu', 'missing-unit':'Thiếu nguồn đơn vị', conflict:'Mâu thuẫn nguồn'},dependencies:{KL1:['funding','related','date'],KL2:['activity','location','date'],KL3:['funding','allocation','date']}};
export function applicable(id:string,date?:string,profile:Profile='standard'){if(profile==='missing-unit'&&id.startsWith('SIM-DV'))return undefined;return sources.find(s=>s.id===id&&date&&s.from<=date&&s.to>=date);}
export function sourceById(id:string){return sources.find(s=>s.id===id);}
