import type { Answer,ClarificationField,Facts,Revision } from './types';
import type { Turn } from './history';
import { factValue,labels } from './presentation';
export type ClarificationExchange={question:string;reply:string;label:string;value:string;field?:ClarificationField;turn:number;accepted:boolean};
export type ConversationBlock={start:number;end:number;prompt:string;answer:Answer;collecting:boolean;exchanges:ClarificationExchange[]};
function exchange(question:Turn,reply:Turn,index:number):ClarificationExchange{
 if(reply.input?.kind==='fact-edit'){const edit=reply.input.edit;return {question:`Chủ động cập nhật ${labels[edit.field].toLowerCase()}`,reply:reply.user,label:labels[edit.field],field:edit.field,value:edit.value===null?'Chưa xác định':factValue(edit.field,reply.answer.facts[edit.field]),turn:index+1,accepted:edit.value!==null};}
 const field=question.answer.clarification?.field;
 const label=field==='situationRelation'?'Tình huống':field==='fundingRelation'?'Quan hệ nguồn hỗ trợ':field?labels[field]:'Thông tin bổ sung';
 const known=field&&field in labels?reply.answer.facts[field as keyof Facts]:undefined;
 return {question:question.answer.question!,reply:reply.user,label,field,value:known!==undefined?factValue(field as keyof Facts,known):reply.user,turn:index+1,accepted:(!reply.answer.intent||reply.answer.intent==='consult')&&!reply.answer.declined&&(field?reply.answer.clarification?.field!==field:reply.answer.question!==question.answer.question)};
}
// Keep the complete raw conversation in storage/API; only group its presentation.
export function conversationBlocks(turns:Turn[]):ConversationBlock[]{
 const blocks:ConversationBlock[]=[];
 for(let index=0;index<turns.length;index++){
  const turn=turns[index],previous=blocks.at(-1);
  if(previous?.collecting&&(!turn.answer.intent||turn.answer.intent==='consult')){previous.exchanges.push(exchange(turns[index-1],turn,index));previous.end=index;previous.answer=turn.answer;previous.collecting=Boolean(turn.answer.question);}
  else blocks.push({start:index,end:index,prompt:turn.user,answer:turn.answer,collecting:Boolean(turn.answer.question),exchanges:[]});
 }
 for(const block of blocks){
  if(block.collecting||!block.exchanges.length)continue;
  const baseline=block.start>0?turns[block.start-1].answer:undefined;
  const startsNew=block.exchanges.some(e=>e.field==='situationRelation'&&/tình huống mới|trường hợp mới/i.test(e.reply));
  const revisions:Revision[]=[];
  if(baseline&&!startsNew){
   const changed=(Object.keys(labels) as (keyof Facts)[]).filter(key=>baseline.facts[key]!==block.answer.facts[key]);
   for(const before of baseline.conclusions){
    if(before.id==='preparation')continue;
    const after=block.answer.conclusions.find(c=>c.id===before.id);
    if(!after||JSON.stringify([before.status,before.text,before.sources.map(s=>s.id)])!==JSON.stringify([after.status,after.text,after.sources.map(s=>s.id)]))revisions.push({id:before.id,title:before.title,before:before.text,after:after?.text??'Không còn áp dụng cho nguồn và dữ kiện hiện tại.',reason:changed.length?`Đã đối chiếu lại sau khi thay đổi ${changed.map(k=>labels[k].toLowerCase()).join(', ')}.`:'Đã đối chiếu lại sau phần làm rõ tình huống.'});
   }
  }
  block.answer={...block.answer,revisions};
 }
 return blocks;
}
