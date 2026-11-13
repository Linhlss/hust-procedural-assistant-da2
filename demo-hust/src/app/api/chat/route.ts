import {resolveChatMode} from '@/lib/chat-mode';
import {KnowledgeConfigurationError} from '@/lib/knowledge-meta';
import {OllamaError} from '@/lib/ollama';
import {GeminiError} from '@/lib/gemini';
import {chatRequestSchema,processConversation,InputError} from '@/lib/conversation-inputs';
export const runtime='nodejs';
const headers={'Cache-Control':'no-store'};
export async function POST(request:Request) {
 try {
  if(request.headers.get('origin') && new URL(request.headers.get('origin')!).host!==(request.headers.get('host')??new URL(request.url).host))return Response.json({error:'Nguồn yêu cầu không hợp lệ.'},{status:403,headers});
  const raw=await request.text(); if(raw.length>150000)return Response.json({error:'Hội thoại quá dài; hãy bắt đầu phiên mới.'},{status:413,headers});
  const parsed=chatRequestSchema.safeParse(JSON.parse(raw));
  if(!parsed.success)return Response.json({error:'Dữ liệu không hợp lệ. Mỗi câu tối đa 2.000 ký tự, mỗi phiên tối đa 24 lượt.'},{status:400,headers});
  const mode=resolveChatMode(process.env.CHAT_ADAPTER);
  const result=await processConversation(parsed.data,mode,{signal:request.signal});
  return Response.json({requestId:parsed.data.requestId,...result},{headers});
 } catch(error) {
  if(error instanceof KnowledgeConfigurationError)return Response.json({error:error.message,code:'KNOWLEDGE_NOT_READY'},{status:503,headers});
  if(error instanceof InputError)return Response.json({error:error.message},{status:400,headers});
  if(error instanceof GeminiError)return Response.json({error:error.userMessage,code:error.code,...(error.diagnostic?{diagnostic:error.diagnostic}:{})},{status:error.code==='GEMINI_QUOTA'?429:error.code==='GEMINI_CONTEXT'?413:error.code==='GEMINI_CANCELLED'?499:503,headers:{...headers,...(error.retryAfter?{'Retry-After':String(error.retryAfter)}:{})}});
  if(error instanceof OllamaError)return Response.json({error:error.userMessage,code:error.code},{status:error.code==='OLLAMA_CONTEXT'?413:error.code==='OLLAMA_CANCELLED'?499:503,headers});
  const badJson=error instanceof SyntaxError;
  return Response.json({error:badJson?'Yêu cầu không đúng định dạng.':'Không thể xử lý hội thoại lúc này. Dữ kiện đang có được giữ nguyên; bạn có thể thử lại. Không có kết luận mới được tạo.'},{status:badJson?400:503,headers});
 }
}
