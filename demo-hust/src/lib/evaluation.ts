import type {Answer,Facts,Source} from './types';
import {sourceById} from './sources';
export type Expected={facts?:Facts;absent?:(keyof Facts)[];includeSources?:string[];excludeSources?:string[];statuses?:Record<string,string>;intent?:string;noQuestion?:boolean;noConclusions?:boolean;pendingFunding?:boolean;pendingSituation?:Facts;pendingAbsent?:(keyof Facts)[];clarification?:string};
export function checkExpected(a:Answer,e:Expected){
 const errors:string[]=[];
 for(const [key,value]of Object.entries(e.facts??{}))if(a.facts[key as keyof Facts]!==value)errors.push(`facts.${key}: expected ${JSON.stringify(value)}, got ${JSON.stringify(a.facts[key as keyof Facts])}`);
 for(const key of e.absent??[])if(a.facts[key]!==undefined)errors.push(`facts.${key} should be absent`);
 if(e.intent&&a.intent!==e.intent)errors.push(`intent: expected ${e.intent}, got ${a.intent}`);
 if(e.clarification&&a.clarification?.field!==e.clarification)errors.push(`clarification: expected ${e.clarification}, got ${a.clarification?.field}`);
 if(e.noQuestion&&a.question)errors.push('Unnecessary clarification: '+a.question);
 if(e.noConclusions&&a.conclusions.length)errors.push('Unexpected conclusions');
 if(e.pendingFunding!==undefined&&Boolean(a.pendingFunding)!==e.pendingFunding)errors.push('pendingFunding differs');
 for(const [key,value]of Object.entries(e.pendingSituation??{}))if(a.pendingSituation?.[key as keyof Facts]!==value)errors.push(`pendingSituation.${key} differs`);
 for(const key of e.pendingAbsent??[])if(a.pendingSituation?.[key]!==undefined)errors.push(`pendingSituation.${key} should be absent`);
 const sources=a.conclusions.flatMap(c=>c.sources),ids=new Set(sources.map(s=>s.id));
 for(const id of e.includeSources??[])if(!ids.has(id))errors.push(`Missing source ${id}`);
 for(const id of e.excludeSources??[])if(ids.has(id))errors.push(`Retired source still used: ${id}`);
 for(const [id,status]of Object.entries(e.statuses??{}))if(a.conclusions.find(c=>c.id===id)?.status!==status)errors.push(`${id} should be ${status}`);
 for(const source of sources){const known=sourceById(source.id);if(!known||(['quote','version','from','to'] as (keyof Source)[]).some(key=>known[key]!==source[key]))errors.push(`Source differs from fixture registry: ${source.id}`);}
 return errors;
}
export function expectedState(previous:Facts,expected:Expected){const next={...previous,...expected.facts};for(const key of expected.absent??[])delete next[key];return next;}
export function unexpectedFacts(actual:Facts,declared:Facts){return (Object.keys(actual) as (keyof Facts)[]).filter(key=>declared[key]===undefined).map(key=>`Unstated fact ${key}: ${JSON.stringify(actual[key])}`);}
export const reviewDimensions=['bám nhu cầu','đủ nội dung','nhất quán ngữ cảnh','căn cứ hỗ trợ','dừng đúng'] as const;
