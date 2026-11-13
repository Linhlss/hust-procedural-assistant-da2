import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {replaySavedCases,type SavedCase} from '../src/lib/replay-evaluation';
async function main(){
const args=process.argv.slice(2),flag=(name:string)=>{const i=args.indexOf(name);return i<0?undefined:args[i+1];};
const input=flag('--input'),output=flag('--output');if(!input||!output)throw new Error('Use --input SAVED_EVALUATION.json --output NEW_REPORT.json');
if(resolve(input)===resolve(output))throw new Error('Không ghi đè bằng chứng gốc');
globalThis.fetch=async()=>{throw new Error('Offline replay forbids network/model calls');};
const bytes=await readFile(input),saved=JSON.parse(bytes.toString()) as {records:SavedCase[]};
if(!Array.isArray(saved.records))throw new Error('Missing saved records');
const result=await replaySavedCases(saved.records);
const code:Record<string,string>={};
for(const path of ['src/lib/gemini.ts','src/lib/replay-evaluation.ts','src/lib/conversation-inputs.ts','src/lib/engine.ts'])code[path]=createHash('sha256').update(await readFile(path)).digest('hex');
await mkdir(dirname(output),{recursive:true});
await writeFile(output,JSON.stringify({at:new Date().toISOString(),inputSha256:createHash('sha256').update(bytes).digest('hex'),code,...result},null,2),{flag:'wx'});
console.log(JSON.stringify({output,...result.summary,modelCalls:0,modelQualityReevaluated:false}));

}
main().catch(error=>{console.error(error instanceof Error?error.message:String(error));process.exitCode=1;});
