import type {Answer,Conclusion} from './types';
import {factValue,labels} from './presentation';
export function visibleAnswerConclusions(answer:Answer):Conclusion[]{
 return answer.pendingSituation?[]:answer.question?answer.conclusions.filter(c=>c.status==='meets'||c.status==='fails'):answer.conclusions;
}
export const conclusionStatuses={scope:'Hướng dẫn áp dụng',meets:'Đáp ứng theo khai báo',fails:'Không đáp ứng theo khai báo',insufficient:'Chưa đủ căn cứ'};
export function answerSummary(answer:Answer):string{
 if(!answer.narrative)return answer.summary;
 const visible=visibleAnswerConclusions(answer);
 const sources=[...new Map(visible.flatMap(c=>c.sources).map(s=>[s.id,s])).values()];
 return [
  answer.sourceLabel,
  ...Object.entries(answer.facts).map(([k,v])=>labels[k as keyof Answer['facts']]+': '+factValue(k as keyof Answer['facts'],v)),
  answer.question?'Cần bổ sung: '+answer.question:'',
  'Phản hồi:',...answer.narrative.paragraphs.map(p=>p.text+(p.sourceIds.length?' ['+p.sourceIds.join(', ')+']':'')),
  visible.length?'Đối chiếu điều kiện:':'',
  ...visible.map(c=>c.title+': '+conclusionStatuses[c.status]),
  answer.revisions.length?'Phần thay đổi:':'',...answer.revisions.map(r=>r.title+': '+r.after),
  sources.length?'Căn cứ:':'',
  ...sources.map(s=>s.id+': '+s.title+', '+s.paragraph+', '+s.version+', '+s.from+' → '+s.to),
 ].filter(Boolean).join('\n');
}
