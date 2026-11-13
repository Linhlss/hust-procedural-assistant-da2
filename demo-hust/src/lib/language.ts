import type { Facts,Patch } from './types';
export const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
type Mention={value:string;index:number;end:number;negative:boolean;prefix:string;text:string};
function clausePrefix(s:string,index:number){return s.slice(0,index).split(/[,;!?]|(?<!\d)\.(?!\d)|\b(?:nhung|ma|chu|thay vao do|tuy nhien)\b/).at(-1)??'';}
function negated(prefix:string){prefix=prefix.replace(/[()"“”]/g,' ');return /\b(?:khong|chang|chua)(?:\s+(?:phai|di|tham|du|su|dung|lay|xin|hoi|ve|den|o|tai|duoc|can|co|thuoc|nguon|kinh|phi|ho|tro|nua|ca|hai))*\s*$/.test(prefix)&&!/\bkhong chi\s*$/.test(prefix);}
function mentions(s:string,patterns:Record<string,RegExp>):Mention[]{const out:Mention[]=[];for(const [value,re] of Object.entries(patterns))for(const m of s.matchAll(new RegExp(re.source,'g'))){const prefix=clausePrefix(s,m.index!);out.push({value,index:m.index!,end:m.index!+m[0].length,negative:negated(prefix)||/\b(?:khong|chua|chang) ho tro\b/.test(m[0]),prefix,text:m[0]});}return out.sort((a,b)=>a.index-b.index);}
function distinct(ms:Mention[]){return [...new Set(ms.filter(m=>!m.negative).map(m=>m.value))];}
function clear(p:Patch,key:keyof Facts){p.ambiguous=true;p.clear=[...new Set([...(p.clear??[]),key])];}
export function activityPatch(text:string,previous:Facts):Partial<Patch>{
 const s=normalize(text),p:Patch={intent:'unknown'};
 const ms=mentions(s,{conference:/\b(?:hoi thao|hoi nghi|conference)\b/,work:/\bcong tac\b/});const values=distinct(ms);
 const destination=ms.filter(m=>!m.negative&&/\b(?:chuyen (?:tu .+ )?sang|sua (?:.+ )?thanh|thay (?:.+ )?bang)\s*$/.test(m.prefix)).at(-1);
 if(destination)p.activity=destination.value as Facts['activity'];
 else if(values.length===1)p.activity=values[0] as Facts['activity'];
 else if(values.length>1||ms.some(m=>m.negative&&m.value===previous.activity))clear(p,'activity');
 const {intent,...result}=p;void intent;return result;
}
export function fundingPatch(text:string,previous:Facts):Partial<Patch>{
 const s=normalize(text),p:Patch={intent:'unknown'};
 const ms=mentions(s,{task:/\b(?:kinh phi|nguon|ngan sach|tien|tai tro)(?:\s+(?:tu|cua|ho tro))?\s+(?:nhiem vu|de tai|du an)\b/,unit:/\b(?:kinh phi|nguon|ngan sach|tien|tai tro)(?:\s+(?:tu|cua|ho tro))?\s+(?:don vi|co quan)\b|\b(?:don vi|co quan)\s+(?:(?:khong|chua|se|co)\s+)?ho tro\b/});
 // Short source names are accepted as a direct reply, or after an explicit use/change verb.
 for(const [value,re] of Object.entries({task:/\b(?:nhiem vu|de tai|du an)\b/g,unit:/\b(?:don vi|co quan)\b/g}))for(const m of s.matchAll(re)){if(ms.some(x=>x.index<=m.index!&&x.end>=m.index!+m[0].length))continue;const prefix=clausePrefix(s,m.index!);if(/^\s*$/.test(prefix)&&/^\s*[.!?]*$/.test(s.slice(m.index!+m[0].length))||/\b(?:va|hay|hoac)\s*$/.test(prefix)&&ms.some(x=>x.index<m.index!)||/\b(?:chuyen(?: han)? (?:sang|ve)|(?:khong |chua )?(?:dung|su dung))\s*$/.test(prefix))ms.push({value,index:m.index!,end:m.index!+m[0].length,negative:negated(prefix)||ms.some(x=>x.negative&&/^\s*(?:va|hay|hoac)\s*$/.test(s.slice(x.end,m.index!))),prefix,text:m[0]});}
 ms.sort((a,b)=>a.index-b.index);const positives=ms.filter(m=>!m.negative),values=distinct(ms),negatives=new Set(ms.filter(m=>m.negative).map(m=>m.value));
 const markers=mentions(s,{combine:/\b(?:ket hop|ca hai|ho tro them|bo sung)\b/});
 const combine=markers.some(m=>!m.negative)&&! /\b(?:hay|hoac|chua ro|chua chot)\b/.test(s);
 const exclusive=positives.filter(m=>/\b(?:chi (?:dung|su dung)|chuyen(?: han)? (?:sang|ve)|(?:sua|doi) (?:.+ )?(?:thanh|sang))\s*$/.test(m.prefix)).at(-1);
 let target=exclusive?.value;
 if(!target&&values.length>1&&/\bthay the\b/.test(s)){
  const afterBang=positives.find(m=>/\bbang\s*$/.test(m.prefix));
  target=afterBang?.value??(s.slice(positives[0].end,positives.at(-1)!.index).includes('thay the')?positives[0].value:undefined);
 }
 if(target){p.funding=target as Facts['funding'];p.fundingAction='replace';}
 else if(combine&&values.includes('unit')&&(values.includes('task')||previous.funding==='task'||previous.funding==='combined'||/\b(?:ca hai|ket hop)\b/.test(s))){p.funding='combined';p.fundingAction='combine';}
 else if(values.length>1){clear(p,'funding');}
 else if(values.length===1){const value=values[0] as 'task'|'unit';
  if(value==='unit'&&(previous.funding==='task'||previous.funding==='combined')&&!negatives.has('task')&&!/\b(?:thay the|hoan toan|chuyen|chi dung|chi su dung)\b/.test(s))p.fundingAction='unclear';
  else {p.funding=value;p.fundingAction='replace';}
 }else if(ms.some(m=>m.negative&&(!previous.funding||m.value===previous.funding||previous.funding==='combined'))){clear(p,'funding');}
 // An explicit either/or or undecided source must not silently retain the old source.
 if(ms.length&&/\b(?:chua ro|chua chot|chua xac dinh)\b/.test(s)){delete p.funding;delete p.fundingAction;clear(p,'funding');}
 const {intent,...result}=p;void intent;return result;
}
export function datePatch(text:string,previous:Facts,valid:(s:string)=>boolean):Partial<Patch>{
 const s=normalize(text),p:Patch={intent:'unknown'};
 const dates:{value:string;index:number;end:number;negative:boolean;prefix:string}[]=[];
 const add=(m:RegExpMatchArray,value:string)=>{if(dates.some(d=>d.index<=m.index!&&d.end>=m.index!+m[0].length))return;const prefix=clausePrefix(s,m.index!);dates.push({value,index:m.index!,end:m.index!+m[0].length,prefix,negative:negated(prefix.replace(/\bngay\s*$/,''))});};
 for(const m of s.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g))add(m,m[0]);
 for(const m of s.matchAll(/\b(\d{1,2})([/.\-])(\d{1,2})\2(20\d{2})\b/g))add(m,`${m[4]}-${m[3].padStart(2,'0')}-${m[1].padStart(2,'0')}`);
 for(const m of s.matchAll(/\b(\d{1,2})\s+thang\s+(\d{1,2})\s+(?:nam\s*)?(20\d{2})\b/g))add(m,`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`);
 dates.sort((a,b)=>a.index-b.index);const positive=dates.filter(d=>!d.negative),values=[...new Set(positive.map(d=>d.value))];
 const replacement=positive.filter(d=>/\b(?:thanh|sang|bang)\s*(?:ngay\s*)?$/.test(d.prefix)).at(-1);
 const value=replacement?.value??(values.length===1?values[0]:undefined);
 if(value&&valid(value))p.date=value;
 else if(positive.length||dates.some(d=>d.negative&&d.value===previous.date)||previous.date&&/\b(?:sua|doi|chuyen|cap nhat)\b.*\b(?:ngay|thang|tuan|thoi diem)\b/.test(s))clear(p,'date');
 const {intent,...result}=p;void intent;return result;
}
export const unsupportedLabels={registration:'đăng ký nhiệm vụ (T1)',extension:'điều chỉnh/gia hạn đề tài (T3)',acceptance:'nghiệm thu đề tài (T4)',training:'cử đi đào tạo/nghiên cứu (T10)'};
export function unsupportedTopic(text:string):keyof typeof unsupportedLabels|undefined{
 const s=normalize(text);const ms=mentions(s,{registration:/\bdang ky\s+(?:nhiem vu|de tai|du an)(?: nghien cuu)?\b/,extension:/\b(?:gia han|dieu chinh)\s+(?:(?:thoi gian|kinh phi|du toan|noi dung|tien do)\s+)?(?:de tai|nhiem vu|du an)\b/,acceptance:/\bnghiem thu\s+(?:de tai|nhiem vu|du an)\b/,training:/\b(?:cu di|di|ho tro)\s+(?:dao tao|du hoc|nghien cuu sinh)\b|\bcu di dao tao\/nghien cuu\b/});
 return ms.find(m=>!m.negative)?.value as keyof typeof unsupportedLabels|undefined;
}
export function situationSignals(text:string){const s=normalize(text);return {
 explicitNew:/\b(?:tinh huong moi|truong hop moi|bat dau (?:lai|moi))\b/.test(s)&&!negated(clausePrefix(s,s.search(/tinh huong moi|truong hop moi|bat dau/))),
 same:/\b(?:tiep tuc tinh huong (?:truoc|cu)|van (?:la )?tinh huong (?:truoc|cu))\b/.test(s),
 other:/\b(?:hoi thao|hoi nghi|chuyen cong tac|tinh huong|truong hop)\s+(?:hoan toan\s+)?(?:khac|moi)\b/.test(s),
 correction:/\b(?:sua|doi|dinh chinh|cap nhat|chuyen sang|khong phai|thay the|thuc ra)\b/.test(s),
 freshPersonal:/\b(?:toi|minh|em)\s+(?:dang la|la)\b[^.!?]{0,70}\b(?:muon|du dinh|du kien)\s+(?:di|du|tham du)\s+(?:hoi thao|hoi nghi|cong tac)\b|\b(?:toi|minh|em)\s+(?:(?:muon|du dinh|du kien|se|sap)\s+)?(?:di|du|tham du)\s+(?:hoi thao|hoi nghi|cong tac)\b/.test(s)
};}
