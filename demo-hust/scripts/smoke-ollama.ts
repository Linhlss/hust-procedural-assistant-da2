import {mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {ollamaExtractHistory} from '../src/lib/ollama';
import {converse} from '../src/lib/engine';
import type {Answer} from '../src/lib/types';
async function main(){
const dir=process.env.HUST_TEST_ARTIFACT_DIR;if(!dir)throw new Error('Set unique HUST_TEST_ARTIFACT_DIR');await mkdir(dir,{recursive:true});
const memory=()=>{try{return execFileSync('memory_pressure',[],{encoding:'utf8'}).match(/System-wide memory free percentage:.*$/m)?.[0];}catch{return 'unavailable';}};
const records:unknown[]=[];const before=memory();
const single=['Tôi muốn đi công tác tại Hà Nội ngày 20/11/2026, dùng kinh phí đơn vị.'];
const dialogue=['Tôi muốn tham dự hội thảo.','Tôi dùng kinh phí nhiệm vụ, ở Hà Nội vào ngày 20/11/2026, có phục vụ đề tài.','Tôi đính chính, nguồn kinh phí chuyển hoàn toàn sang đơn vị.'];
let passed=true;
for(const [id,turns] of [['cold-single',single],...dialogue.map((_,i)=>[`warm-turn-${i+1}`,dialogue.slice(0,i+1)])] as [string,string[]][]){
 const traces:unknown[]=[];const started=performance.now();let answer:Answer|undefined,error:string|undefined;
 try{const patches=await ollamaExtractHistory(turns,{}, {onTrace:t=>traces.push(t)});let i=0;answer=await converse(turns,'standard',async()=>patches[i++],'ollama');
 if(id==='cold-single'&&(answer.facts.activity!=='work'||answer.facts.funding!=='unit'||answer.facts.date!=='2026-11-20'))throw new Error('SMOKE_FACTS');
 if(id==='warm-turn-3'&&(answer.facts.funding!=='unit'||answer.conclusions.some(c=>c.id==='task')))throw new Error('SMOKE_REPLACEMENT');
 }catch(e){error=e instanceof Error?e.message:String(e);passed=false;}
 const record={id,messages:turns,elapsedMs:performance.now()-started,answer,error,traces,memory:memory()};records.push(record);
 await writeFile(`${dir}/smoke.json`,JSON.stringify({passed,before,records,after:memory(),live_model_called:true,policy_validation:false},null,2));
 console.log(id,error??'passed',Math.round(record.elapsedMs)+'ms',record.memory);
 if(error)break;
}
if(!passed)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1;});
