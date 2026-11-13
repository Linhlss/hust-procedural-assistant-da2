import Chat from '@/components/Chat';
import {resolveChatMode} from '@/lib/chat-mode';
export const dynamic='force-dynamic';
export default function Page(){const mode=resolveChatMode(process.env.CHAT_ADAPTER);return <Chat mode={mode}/>;}
