import test from 'node:test';
import assert from 'node:assert/strict';
import {ollamaExtractHistory,OllamaError,ollamaConfiguration} from '../src/lib/ollama';
import {POST} from '../src/app/api/chat/route';
import {readHistory,saveConversation,freshConversation,appendTurn} from '../src/lib/history';
import {converse} from '../src/lib/engine';
const empty=()=>({intent:'consult',unsupportedTopic:null,activity:null,location:null,date:null,funding:null,related:null,allocation:null,fundingAction:null,topic:null,personal:false,general:false,declined:false,ambiguous:false,newSituation:false,sameSituation:false,situationUnclear:false,pendingSituationAction:null,clear:[]});
const body=(patches:unknown[])=>({done:true,done_reason:'stop',message:{role:'assistant',content:JSON.stringify({patches})}});
async function mock(value:unknown,run:()=>Promise<void>,inspect?:(request:Record<string,unknown>)=>void){const old=globalThis.fetch;let calls=0;globalThis.fetch=async(_,o)=>{calls++;inspect?.(JSON.parse(String(o?.body)));return Response.json(value);};try{await run();return calls;}finally{globalThis.fetch=old;}}
test('Ollama enforces complete JSON schema and explicit local generation controls',async()=>{
 const count=await mock(body([{...empty(),activity:'work',funding:'unit'}]),async()=>{const p=await ollamaExtractHistory(['Tôi đi công tác bằng kinh phí đơn vị.']);assert.equal(p[0].funding,'unit');},r=>{assert.equal(r.think,false);assert.equal(r.stream,false);assert.equal((r.options as {temperature:number}).temperature,0);assert.deepEqual((r.format as {required:string[]}).required,['patches']);});assert.equal(count,1);
});
test('Ollama rejects invalid dates, wrong patch counts, made-up policy fields and truncated output',async()=>{
 for(const b of [body([]),body([{...empty(),date:'2026-02-31'}]),body([{...empty(),policy:'Invented'}]),{...body([empty()]),done_reason:'length'}])await mock(b,async()=>{await assert.rejects(ollamaExtractHistory(['Tôi đi hội thảo.']),e=>e instanceof OllamaError&&e.code==='OLLAMA_SCHEMA');});
});
test('Ollama preserves withdrawn fields and false facts for the existing engine',async()=>{
 await mock(body([{...empty(),activity:'conference',related:false},{...empty(),ambiguous:true,clear:['date']}]),async()=>{const p=await ollamaExtractHistory(['Tôi đi hội thảo không phục vụ nhiệm vụ.','Xin rút lại ngày.']);assert.equal(p[0].related,false);assert.deepEqual(p[1].clear,['date']);});
});
test('oversized local context is rejected before any request, without truncating history',async()=>{
 const count=await mock({},async()=>{await assert.rejects(ollamaExtractHistory(Array(24).fill('Tôi hỏi '+ 'dữ kiện '.repeat(200))),e=>e instanceof OllamaError&&e.code==='OLLAMA_CONTEXT');});assert.equal(count,0);
});
test('Ollama only connects to loopback and cannot be enabled on Vercel',()=>{
 const old={base:process.env.OLLAMA_BASE_URL,vercel:process.env.VERCEL};try{process.env.OLLAMA_BASE_URL='https://example.com';assert.throws(ollamaConfiguration);process.env.OLLAMA_BASE_URL='http://127.0.0.1:11434';process.env.VERCEL='1';assert.throws(ollamaConfiguration);}finally{for(const [k,v] of Object.entries({OLLAMA_BASE_URL:old.base,VERCEL:old.vercel})){if(v===undefined)delete process.env[k];else process.env[k]=v;}}
});
test('cancelled local inference stops instead of falling back to fixture',async()=>{
 const old=globalThis.fetch,c=new AbortController();globalThis.fetch=async(_,o)=>new Promise((_,reject)=>{const s=o?.signal;s?.addEventListener('abort',()=>reject(s.reason),{once:true});});try{const p=ollamaExtractHistory(['Tôi đi công tác.'],{}, {signal:c.signal});c.abort();await assert.rejects(p,e=>e instanceof OllamaError&&e.code==='OLLAMA_CANCELLED');}finally{globalThis.fetch=old;}
});
test('API exposes local schema failure without returning an answer',async()=>{
 const mode=process.env.CHAT_ADAPTER;process.env.CHAT_ADAPTER='ollama';try{await mock(body([]),async()=>{const r=await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({messages:['Tôi đi công tác.'],requestId:'local-error'})}));assert.equal(r.status,503);const data=await r.json();assert.equal(data.code,'OLLAMA_SCHEMA');assert.equal(data.answer,undefined);});}finally{if(mode===undefined)delete process.env.CHAT_ADAPTER;else process.env.CHAT_ADAPTER=mode;}
});
test('local answers and existing fixture/OpenAI histories remain readable together',async()=>{
 const data=new Map<string,string>();const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};
 const a=await converse(['Tôi đi hội thảo.']);for(const mode of ['fixture','openai','ollama'] as const){saveConversation(storage,appendTurn(freshConversation('standard',mode),{user:'Tôi đi hội thảo.',answer:{...a,mode}}));}assert.equal(readHistory(storage).length,3);
});


test('local timeout is bounded at 120 seconds and reports timeout without fixture fallback',async()=>{
 const originalTimeout=AbortSignal.timeout,originalFetch=globalThis.fetch;let requested=0;
 AbortSignal.timeout=(ms:number)=>{requested=ms;const c=new AbortController();setTimeout(()=>c.abort(new DOMException('Timeout','TimeoutError')),5);return c.signal;};
 globalThis.fetch=async(_,o)=>new Promise((_,reject)=>{const signal=o?.signal;if(signal?.aborted)reject(signal.reason);else signal?.addEventListener('abort',()=>reject(signal.reason),{once:true});});
 try{await assert.rejects(ollamaExtractHistory(['Tôi đi hội thảo.']),e=>e instanceof OllamaError&&e.code==='OLLAMA_TIMEOUT');assert.equal(requested,120000);}finally{AbortSignal.timeout=originalTimeout;globalThis.fetch=originalFetch;}
});
test('unavailable Ollama is explicit and does not make a second request',async()=>{
 const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;return Response.json({error:'not loaded'},{status:503});};
 try{await assert.rejects(ollamaExtractHistory(['Tôi đi hội thảo.']),e=>e instanceof OllamaError&&e.code==='OLLAMA_UNAVAILABLE');assert.equal(calls,1);}finally{globalThis.fetch=original;}
});

test('focused extraction keeps the complete earlier history and requests only the new patch',async()=>{
 await mock(body([{...empty(),date:'2026-11-15'}]),async()=>{const p=await ollamaExtractHistory(['Nội dung đầu tiên phải được giữ.','Tôi cập nhật địa điểm: Nước ngoài.','15/11/2026.'],{location:'foreign'},{focusIndex:2});assert.equal(p.length,1);assert.equal(p[0].date,'2026-11-15');},request=>{
  const messages=request.messages as {role:string;content:string}[];const input=JSON.parse(messages[1].content);assert.deepEqual(input.history,['Nội dung đầu tiên phải được giữ.','Tôi cập nhật địa điểm: Nước ngoài.']);assert.deepEqual(input.messages,['15/11/2026.']);assert.equal(input.previous.location,'foreign');
 });
});
