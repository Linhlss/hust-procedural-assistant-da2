import {chatModes,type ChatMode} from './types';
export function resolveChatMode(value:string|undefined):ChatMode {
 const mode=value??'fixture';
 if(!(chatModes as readonly string[]).includes(mode))throw new Error('MODEL_CONFIG');
 return mode as ChatMode;
}
