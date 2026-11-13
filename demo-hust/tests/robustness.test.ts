import test from 'node:test';
import assert from 'node:assert/strict';
import { converse } from '../src/lib/engine';
import { auditCases,auditErrors } from './robustness-cases';
for(const c of auditCases)test(`${c.id}: ${c.issue} regression`,async()=>{const a=await converse(c.messages);assert.deepEqual(auditErrors(c,a),[],JSON.stringify({case:c,answer:a}));});

import { conversationBlocks } from '../src/lib/timeline';
import { appendTurn,freshConversation,readHistory,saveConversation,type StorageLike } from '../src/lib/history';
test('unsupported topic interrupts clarification without pretending it answered the question',async()=>{const texts=['Tôi muốn đi hội thảo.','Tôi cần hỏi về gia hạn đề tài.'];const turns=[];for(let i=1;i<=texts.length;i++)turns.push({user:texts[i-1],answer:await converse(texts.slice(0,i))});const blocks=conversationBlocks(turns);assert.equal(blocks.length,2);assert.equal(blocks[0].exchanges.length,0);assert.equal(blocks[1].exchanges.length,0);assert.equal(blocks[1].answer.intent,'unsupported');assert.equal(blocks[1].answer.question,undefined);});
test('pending situation and funding relation survive saved history without losing the new location',async()=>{const texts=['Hội thảo tại Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.','Một hội thảo khác ở Nhật Bản dùng nguồn đơn vị thì sao?'];const answer=await converse(texts);const map=new Map<string,string>();const storage:StorageLike={getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v);},removeItem:k=>{map.delete(k);}};saveConversation(storage,appendTurn(freshConversation(),{user:texts[1],answer}));const saved=readHistory(storage)[0].turns[0].answer;assert.equal(saved.pendingSituation?.location,'foreign');assert.equal(saved.pendingSituationAction,'unclear');const continued=await converse([...texts,'Tôi tiếp tục tình huống trước.']);assert.equal(continued.clarification?.field,'fundingRelation');});
