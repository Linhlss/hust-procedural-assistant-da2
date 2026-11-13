import { z } from 'zod';
import {fixtureKnowledge} from './knowledge-meta';
import {recordedInputSchema,type RecordedInput} from './input-schema';
import { chatModes,type Answer,type Profile } from './types';
export type Turn={user:string;answer:Answer;input?:RecordedInput};
export type Conversation={id:string;title:string;createdAt:number;updatedAt:number;profile:Profile;turns:Turn[];legacy?:boolean};
export const HISTORY_KEY='hust-conversations-v2';
export const ACTIVE_KEY='hust-active-conversation-v2';
export const MAX_HISTORY=20;
export const RETENTION_DAYS=30;
export interface StorageLike{getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void}
const source=z.object({id:z.string(),title:z.string(),domain:z.string(),version:z.string(),from:z.string(),to:z.string(),paragraph:z.string(),quote:z.string(),documentId:z.string().optional(),fragment:z.string().optional(),provenance:z.literal('synthetic_fixture'),publication:z.literal('demo_generated'),owner:z.null()});
const facts=z.object({activity:z.enum(['conference','work']).optional(),location:z.enum(['domestic','foreign']).optional(),date:z.string().optional(),funding:z.enum(['task','unit','combined']).optional(),related:z.boolean().optional(),allocation:z.boolean().optional()});
const answer=z.object({knowledge:z.object({id:z.string(),version:z.string(),kind:z.enum(['synthetic_fixture','provided_document'])}).default({...fixtureKnowledge}),intent:z.enum(['consult','out','unknown','unsupported']).optional(),turn:z.number(),mode:z.enum(chatModes),narrative:z.object({model:z.string(),paragraphs:z.array(z.object({text:z.string(),sourceIds:z.array(z.string())}))}).optional(),modelRun:z.object({provider:z.literal('gemini'),model:z.string(),guards:z.array(z.object({field:z.enum(['activity','location','date','funding','related','allocation']),reason:z.string()})).optional(),stages:z.array(z.object({attempt:z.number().optional(),phase:z.enum(['extract','compose']),elapsedMs:z.number(),status:z.number(),usage:z.unknown()}))}).optional(),inputMethod:z.enum(['message','fact-edit']).optional(),text:z.string(),question:z.string().optional(),facts,conclusions:z.array(z.object({id:z.string(),group:z.enum(['KL1','KL2','KL3']),title:z.string(),status:z.enum(['scope','meets','fails','insufficient']),text:z.string(),facts:z.array(z.enum(['activity','location','date','funding','related','allocation'])),sources:z.array(source),next:z.string(),reason:z.string(),points:z.array(z.string()).optional()})),revisions:z.array(z.object({id:z.string(),title:z.string(),before:z.string(),after:z.string(),reason:z.string()})),changed:z.array(z.string()),profile:z.enum(['standard','missing-unit','conflict']),pendingFunding:z.boolean().optional(),summary:z.string(),sourceLabel:z.string(),consultation:z.boolean().optional(),pendingSituation:facts.optional(),pendingSituationAction:z.enum(['replace','combine','unclear']).optional(),clarification:z.object({field:z.enum(['activity','funding','location','date','related','allocation','fundingRelation','situationRelation']),question:z.string(),reason:z.string(),choices:z.array(z.object({label:z.string(),message:z.string()})),remaining:z.array(z.enum(['activity','funding','location','date','related','allocation','fundingRelation','situationRelation'])),collected:z.number(),total:z.number()}).optional(),preparationOnly:z.boolean().optional(),requestedTopic:z.enum(['documents','steps','timing','sources']).optional(),declined:z.boolean().optional()});
const turn=z.object({user:z.string().min(1).max(2000),answer,input:recordedInputSchema.optional()});
const conversation=z.object({id:z.string().min(1).max(100),title:z.string().max(100),createdAt:z.number(),updatedAt:z.number(),profile:z.enum(['standard','missing-unit','conflict']),turns:z.array(turn).min(1).max(24),legacy:z.boolean().optional()});
export function freshConversation(profile:Profile='standard',id=crypto.randomUUID(),now=Date.now()):Conversation{return {id,title:'Hội thoại mới',createdAt:now,updatedAt:now,profile,turns:[]};}
export function readHistory(storage:StorageLike,now=Date.now()):Conversation[]{const raw=storage.getItem(HISTORY_KEY);if(!raw)return [];let data:unknown;try{data=JSON.parse(raw);}catch{return [];}
 if(!Array.isArray(data))return [];const result:Conversation[]=[];
 for(const item of data){const parsed=conversation.safeParse(item);if(parsed.success&&parsed.data.updatedAt>now-RETENTION_DAYS*86400000&&parsed.data.updatedAt<=now+60000&&!result.some(c=>c.id===parsed.data.id))result.push(parsed.data as Conversation);}
 return result.sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,MAX_HISTORY);
}
export function saveConversation(storage:StorageLike,next:Conversation,now=Date.now()):Conversation[]{const parsed=conversation.parse(next);const records=[parsed as Conversation,...readHistory(storage,now).filter(c=>c.id!==next.id)].sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,MAX_HISTORY);let serialized=JSON.stringify(records);
 while(serialized.length>2000000&&records.length>1){const index=records.findLastIndex(c=>c.id!==next.id);records.splice(index,1);serialized=JSON.stringify(records);}
 storage.setItem(HISTORY_KEY,serialized);return records;
}
export function deleteConversation(storage:StorageLike,id:string,now=Date.now()):Conversation[]{const records=readHistory(storage,now).filter(c=>c.id!==id);storage.setItem(HISTORY_KEY,JSON.stringify(records));return records;}
export function appendTurn(current:Conversation,next:Turn,now=Date.now()):Conversation{return {...current,title:current.turns.length?current.title:next.user.replace(/\s+/g,' ').slice(0,72),updatedAt:now,turns:[...current.turns,next],legacy:false};}
export function migrateLegacy(storage:StorageLike,session:StorageLike):Conversation|undefined{const raw=session.getItem('hust-demo-v1');if(!raw)return;let value;try{value=JSON.parse(raw);}catch{session.removeItem('hust-demo-v1');return;}
 const turns=z.array(turn).min(1).max(24).safeParse(value.turns);if(!turns.success)return;
 const legacy={...freshConversation(value.profile==='conflict'?'conflict':'standard'),title:turns.data[0].user.slice(0,72),turns:turns.data as Turn[],legacy:true};saveConversation(storage,legacy);session.removeItem('hust-demo-v1');return legacy;
}
