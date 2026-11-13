import type {Conversation} from './history';
import {factValue,labels} from './presentation';
import type {Facts} from './types';
export const foldSearch=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').replace(/[đĐ]/g,'d').toLocaleLowerCase('vi');
export const searchTerms=(query:string)=>[...new Set(foldSearch(query).replace(/[^\p{L}\p{N}]+/gu,' ').trim().split(/\s+/).filter(Boolean))];
type Segment={label:string;text:string};
function segments(chat:Conversation):Segment[]{
 const list:Segment[]=[{label:'Tên hội thoại',text:chat.title}];
 for(const t of chat.turns){
  const a=t.answer;list.push({label:'Bạn',text:t.user},{label:'Trợ lý',text:[a.text,...(a.narrative?.paragraphs.map(p=>p.text)??[]),a.question,a.summary,a.sourceLabel].filter(Boolean).join('\n')});
  if(a.clarification)list.push({label:'Câu hỏi làm rõ',text:[a.clarification.question,a.clarification.reason,...a.clarification.choices.map(c=>c.label)].join('\n')});
  for(const [key,value]of Object.entries(a.pendingSituation??{}))list.push({label:'Dữ kiện đang chờ',text:`${labels[key as keyof Facts]}: ${factValue(key as keyof Facts,value)}`});
  for(const [key,value]of Object.entries(a.facts))list.push({label:'Dữ kiện',text:`${labels[key as keyof Facts]}: ${factValue(key as keyof Facts,value)}`});
  for(const c of a.conclusions){list.push({label:'Hướng dẫn',text:[c.title,c.text,...c.points??[],c.next,c.reason].join('\n')});for(const s of c.sources)list.push({label:'Căn cứ',text:[s.title,s.quote,s.paragraph,s.version,s.from,s.to].join('\n')});}
  for(const r of a.revisions)list.push({label:'Phần thay đổi',text:[r.title,r.before,r.after,r.reason].join('\n')});
 }
 return list;
}
function excerpt(text:string,terms:string[]){
 const clean=text.replace(/\s+/g,' ').trim(),parts=highlightParts(clean,terms.join(' '));let offset=0,first=0;
 for(const part of parts){if(part.match){first=offset;break;}offset+=part.text.length;}
 const start=Math.max(0,first-35),end=Math.min(clean.length,start+150);return (start?'…':'')+clean.slice(start,end)+(end<clean.length?'…':'');
}
export function searchConversations(chats:Conversation[],query:string){
 const terms=searchTerms(query);
 return chats.flatMap(chat=>{
  if(!terms.length)return [{chat,snippet:undefined as {label:string;text:string}|undefined}];
  const items=segments(chat),all=foldSearch(items.map(s=>s.text).join('\n'));
  if(!terms.every(term=>all.includes(term)))return [];
  const best=[...items].sort((a,b)=>terms.filter(t=>foldSearch(b.text).includes(t)).length-terms.filter(t=>foldSearch(a.text).includes(t)).length)[0];
  return [{chat,snippet:{label:best.label,text:excerpt(best.text,terms)}}];
 });
}
export function highlightParts(text:string,query:string){
 const terms=searchTerms(query);if(!terms.length)return [{text,match:false}];
 let folded='';const starts:number[]=[],ends:number[]=[];
 for(const p of new Intl.Segmenter('vi',{granularity:'grapheme'}).segment(text)){const f=foldSearch(p.segment);folded+=f;for(let i=0;i<f.length;i++){starts.push(p.index);ends.push(p.index+p.segment.length);}}
 const ranges:[number,number][]=[];
 for(const term of terms){let at=0;while((at=folded.indexOf(term,at))>=0){ranges.push([starts[at],ends[at+term.length-1]]);at+=Math.max(1,term.length);}}
 ranges.sort((a,b)=>a[0]-b[0]);const merged:[number,number][]=[];for(const r of ranges){const last=merged.at(-1);if(last&&r[0]<=last[1])last[1]=Math.max(last[1],r[1]);else merged.push([...r]);}
 const parts:{text:string;match:boolean}[]=[];let from=0;for(const [start,end]of merged){if(start>from)parts.push({text:text.slice(from,start),match:false});parts.push({text:text.slice(start,end),match:true});from=end;}if(from<text.length)parts.push({text:text.slice(from),match:false});return parts.length?parts:[{text,match:false}];
}
