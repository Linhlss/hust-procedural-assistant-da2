import {modelInstructions,patchSchema,parseModelPatches} from './extractor';
import {z} from 'zod';
import type {Facts,Patch} from './types';

export const OLLAMA_TIMEOUT_MS=120000;
export const OLLAMA_CONTEXT=16384;
export const OLLAMA_OUTPUT=4096;
const suffix=[
 'Duyệt messages theo đúng thứ tự: patches[i] chỉ ghi thông tin có trong messages[i]. Không gộp các lượt thành một bản tóm tắt. Không điền hồi tố thông tin ở lượt sau vào patch trước.',
 'Ví dụ lượt đầu chỉ nói muốn đi công tác, lượt sau mới nói ngày: patch đầu có date null, patch sau có ngày; patch sau không chép lại activity từ lượt đầu.',
 'related và allocation phải null nếu lượt đó không nêu, chỉ false khi có phủ định rõ. Các cờ điều khiển như declined, ambiguous, newSituation, sameSituation, situationUnclear mặc định false.',
 'Bắt đầu hội thoại không tự có nghĩa newSituation. Chỉ đánh dấu chuyển/giữ tình huống khi có xác nhận tương ứng. previous là dữ kiện trước toàn bộ messages.',
 'Trả duy nhất JSON có mảng patches đúng số lượt yêu cầu, không trả giải thích hoặc chính sách.'
].join('\n');
type Code='OLLAMA_CONFIG'|'OLLAMA_UNAVAILABLE'|'OLLAMA_TIMEOUT'|'OLLAMA_CONTEXT'|'OLLAMA_SCHEMA'|'OLLAMA_CANCELLED';
const messages:Record<Code,string>={
 OLLAMA_CONFIG:'Chưa cấu hình được mô hình tại máy. Hãy kiểm tra Ollama và tên mô hình. Dữ kiện đang có được giữ nguyên.',
 OLLAMA_UNAVAILABLE:'Không kết nối được mô hình tại máy. Hãy kiểm tra Ollama đang chạy rồi thử lại. Không có kết luận mới được tạo.',
 OLLAMA_TIMEOUT:'Mô hình tại máy chưa phản hồi trong 120 giây. Dữ kiện đang có được giữ nguyên; bạn có thể thử lại.',
 OLLAMA_CONTEXT:'Hội thoại vượt ngữ cảnh đang cấu hình cho mô hình tại máy. Hãy bắt đầu hội thoại mới; lịch sử hiện tại vẫn được giữ.',
 OLLAMA_SCHEMA:'Mô hình tại máy chưa trả dữ kiện hợp lệ. Dữ kiện đang có được giữ nguyên; bạn có thể thử lại. Không có kết luận mới được tạo.',
 OLLAMA_CANCELLED:'Yêu cầu đã được hủy; không tạo kết luận mới.'
};
export class OllamaError extends Error{constructor(public code:Code,options?:ErrorOptions){super(code,options);}get userMessage(){return messages[this.code];}}
export type OllamaTrace={phase:'response';elapsedMs:number;body:unknown;request:{model:string;think:false;stream:false;options:{temperature:number;num_ctx:number;num_predict:number}}};
type Options={signal?:AbortSignal;onTrace?:(trace:OllamaTrace)=>void;focusIndex?:number};
export function ollamaConfiguration(){
 const url=new URL(process.env.OLLAMA_BASE_URL??'http://127.0.0.1:11434');
 if(!['localhost','127.0.0.1','[::1]'].includes(url.hostname)||!['http:','https:'].includes(url.protocol)||url.username||url.password||process.env.VERCEL)throw new OllamaError('OLLAMA_CONFIG');
 const model=process.env.OLLAMA_MODEL??'qwen3.5:9b';if(!model.trim())throw new OllamaError('OLLAMA_CONFIG');
 return {url:new URL('/api/chat',url).href,model};
}
export async function ollamaExtractHistory(turns:string[],previous:Facts={},options:Options={}):Promise<Patch[]>{
 let config:ReturnType<typeof ollamaConfiguration>;
 try{config=ollamaConfiguration();}catch(e){throw e instanceof OllamaError?e:new OllamaError('OLLAMA_CONFIG',{cause:e});}
 const focus=options.focusIndex;
 const requested=focus===undefined?turns:[turns[focus]];
 if(requested.some(t=>typeof t!=='string'))throw new OllamaError('OLLAMA_CONFIG');
 const {$schema:ignored,...itemSchema}=z.toJSONSchema(patchSchema);void ignored;
 const format={type:'object',additionalProperties:false,properties:{patches:{type:'array',items:itemSchema,minItems:requested.length,maxItems:requested.length}},required:['patches']};
 const prompt=modelInstructions+suffix+'\nJSON Schema: '+JSON.stringify(format);
 const input=JSON.stringify(focus===undefined?{previous,messages:turns}:{previous,history:turns.slice(0,focus),messages:requested,note:'history chỉ là ngữ cảnh, các lượt trước đã được ghi nhận. Chỉ trích messages thành đúng một patch, không chép lại dữ kiện cũ.'});
 // Byte-level BPE token count cannot exceed UTF-8 bytes. Reserve output plus chat framing.
 // This deliberately conservative guard prevents Ollama silently truncating older turns.
 if(Buffer.byteLength(prompt,'utf8')+Buffer.byteLength(input,'utf8')+OLLAMA_OUTPUT+512>OLLAMA_CONTEXT)throw new OllamaError('OLLAMA_CONTEXT');
 const timeout=AbortSignal.timeout(OLLAMA_TIMEOUT_MS),signal=options.signal?AbortSignal.any([options.signal,timeout]):timeout;
 const request={model:config.model,think:false as const,stream:false as const,options:{temperature:0,num_ctx:OLLAMA_CONTEXT,num_predict:OLLAMA_OUTPUT}};
 const started=performance.now();
 try{
  const response=await fetch(config.url,{method:'POST',signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({...request,format,messages:[{role:'system',content:prompt},{role:'user',content:input}]})});
  if(!response.ok)throw new OllamaError('OLLAMA_UNAVAILABLE');
  const body=await response.json();options.onTrace?.({phase:'response',elapsedMs:performance.now()-started,body,request});
  if(body.error||body.done!==true||body.done_reason!=='stop'||typeof body.message?.content!=='string')throw new OllamaError('OLLAMA_SCHEMA');
  try{return parseModelPatches(JSON.parse(body.message.content),requested);}catch(e){throw new OllamaError('OLLAMA_SCHEMA',{cause:e});}
 }catch(e){
  if(options.signal?.aborted)throw new OllamaError('OLLAMA_CANCELLED',{cause:e});
  if(timeout.aborted)throw new OllamaError('OLLAMA_TIMEOUT',{cause:e});
  throw e instanceof OllamaError?e:new OllamaError('OLLAMA_UNAVAILABLE',{cause:e});
 }
}
