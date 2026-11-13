import {normalize} from './extractor';
import type {Facts} from './types';
// Narrow checks for categorical claims that contradict declared boolean facts.
// Conditional rules and explicit requests to clarify a fact are not declarations.
export function narrativeFactIssue(value:string,facts:Facts):string|undefined{
 const text=normalize(value);
 for(const sentence of text.split(/[.!?;\n]/)){
  const checks:[keyof Pick<Facts,'allocation'|'related'>,RegExp][]=[
   ['allocation',/\b(da|chua|khong)(?:\s+duoc)?\s+(?:phan dinh|phan chia|phan bo|tach rieng|tach bach)/g],
   ['related',/\b(co|khong|chua)(?:\s+(?:thuc su|truc tiep))?\s+(?:phuc vu|lien quan(?:\s+(?:den|toi))?)/g],
  ];
  for(const [field,pattern] of checks)for(const match of sentence.matchAll(pattern)){
   const index=match.index??0,prefix=sentence.slice(Math.max(0,index-90),index);
   if(field==='related'&&!/nhiem vu|de tai/.test(sentence.slice(index,index+100)))continue;
   if(/\b(neu|khi|gia su)\b|truong hop|chua (ro|biet|xac dinh)|can (biet|lam ro|xac nhan|xac dinh)|can (?:them )?thong tin (?:de )?xac dinh|de xac dinh/.test(prefix))continue;
   const declared=facts[field],asserted=field==='allocation'?match[1]==='da':match[1]==='co';
   if(declared===undefined)return field+'_unknown';
   if(declared!==asserted)return field+'_contradiction';
  }
 }
 return undefined;
}
