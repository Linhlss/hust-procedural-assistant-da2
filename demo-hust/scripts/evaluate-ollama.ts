import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {converse} from '../src/lib/engine';
import {ollamaExtractHistory} from '../src/lib/ollama';
import {sourceById} from '../src/lib/sources';
import type {Answer,Profile,Facts} from '../src/lib/types';
type Expected={facts?:Facts;absent?:(keyof Facts)[];includeSources?:string[];excludeSources?:string[];statuses?:Record<string,string>;intent?:string;noConclusions?:boolean;pendingFunding?:boolean;pendingSituation?:Facts;pendingAbsent?:(keyof Facts)[];clarification?:string};
type Case={id:string;group:string;profile:Profile;turns:{text:string;expected:Expected}[]};
function check(a:Answer,e:Expected):string[]{
 const errors:string[]=[];for(const [k,v] of Object.entries(e.facts??{}))if(a.facts[k as keyof Facts]!==v)errors.push(`facts.${k}: expected ${JSON.stringify(v)}, got ${JSON.stringify(a.facts[k as keyof Facts])}`);
 for(const k of e.absent??[])if(a.facts[k]!==undefined)errors.push(`facts.${k} should be absent`);
 if(e.intent&&a.intent!==e.intent)errors.push(`intent: expected ${e.intent}, got ${a.intent}`);
 if(e.clarification&&a.clarification?.field!==e.clarification)errors.push(`clarification: expected ${e.clarification}, got ${a.clarification?.field}`);
 if(e.noConclusions&&a.conclusions.length)errors.push('Unexpected conclusions');
 if(e.pendingFunding!==undefined&&Boolean(a.pendingFunding)!==e.pendingFunding)errors.push('pendingFunding differs');
 for(const [k,v] of Object.entries(e.pendingSituation??{}))if(a.pendingSituation?.[k as keyof Facts]!==v)errors.push(`pendingSituation.${k} differs`);
 for(const k of e.pendingAbsent??[])if(a.pendingSituation?.[k]!==undefined)errors.push(`pendingSituation.${k} should be absent`);
 const ids=new Set(a.conclusions.flatMap(c=>c.sources.map(s=>s.id)));
 for(const id of e.includeSources??[])if(!ids.has(id))errors.push(`Missing source ${id}`);
 for(const id of e.excludeSources??[])if(ids.has(id))errors.push(`Retired source still used: ${id}`);
 for(const [id,status] of Object.entries(e.statuses??{}))if(a.conclusions.find(c=>c.id===id)?.status!==status)errors.push(`${id} should be ${status}`);
 for(const c of a.conclusions)for(const source of c.sources){const known=sourceById(source.id);if(!known||known.quote!==source.quote||known.version!==source.version)errors.push('Source differs from fixture registry');}
 return errors;
}
async function main(){
 const dir=process.env.HUST_TEST_ARTIFACT_DIR;if(!dir)throw new Error('Set unique HUST_TEST_ARTIFACT_DIR');await mkdir(dir,{recursive:true});
 const bytes=await readFile('tests/ollama-cases.json'),sha256=createHash('sha256').update(bytes).digest('hex');
 if(sha256!=='f6bc5a0f27c3585c9eae303d59e91e04a994217f3c59d9e2b4945e9bb724046e')throw new Error('Frozen cohort changed');
 const {cases}=JSON.parse(bytes.toString()) as {cases:Case[]};await writeFile(`${dir}/frozen-cases.json`,bytes);
 const code:Record<string,string>={};for(const name of ['src/lib/ollama.ts','src/lib/extractor.ts','src/lib/engine.ts','scripts/evaluate-ollama.ts'])code[name]=createHash('sha256').update(await readFile(name)).digest('hex');
 const baseline:{id:string;group:string;passed:boolean;turns:{turn:number;expected:Expected;answer:Answer;errors:string[]}[]}[]=[];for(const c of cases){const turns=[];for(let i=0;i<c.turns.length;i++){const a=await converse(c.turns.slice(0,i+1).map(t=>t.text),c.profile);turns.push({turn:i+1,expected:c.turns[i].expected,answer:a,errors:check(a,c.turns[i].expected)});}baseline.push({id:c.id,group:c.group,passed:turns.every(t=>!t.errors.length),turns});}
 await writeFile(`${dir}/fixture-baseline.json`,JSON.stringify({cohortSha256:sha256,dialogues:20,passed:baseline.filter(c=>c.passed).length,records:baseline},null,2));
 const memory=()=>{try{return execFileSync('memory_pressure',[],{encoding:'utf8'}).match(/System-wide memory free percentage:.*$/m)?.[0];}catch{return 'unavailable';}};
 const metadata={cohortSha256:sha256,code,startedAt:new Date().toISOString(),model:process.env.OLLAMA_MODEL??'qwen3.5:9b',hardware:{cpu:execFileSync('sysctl',['-n','machdep.cpu.brand_string'],{encoding:'utf8'}).trim(),ramBytes:Number(execFileSync('sysctl',['-n','hw.memsize'],{encoding:'utf8'}))},ollamaVersion:execFileSync('ollama',['--version'],{encoding:'utf8'}).trim(),modelDetails:execFileSync('ollama',['show',process.env.OLLAMA_MODEL??'qwen3.5:9b'],{encoding:'utf8'}),live_model_called:true,policy_validation:false};
 const records:{id:string;group:string;passed:boolean;turns:unknown[];memory:string|undefined}[]=[];
 const elapsed:number[]=[];let calls=0,passedTurns=0,finished=false;
 async function save(){const sorted=[...elapsed].sort((a,b)=>a-b);await writeFile(`${dir}/ollama-results.json`,JSON.stringify({...metadata,finishedAt:finished?new Date().toISOString():null,summary:{plannedDialogues:20,plannedTurns:cases.reduce((n,c)=>n+c.turns.length,0),completedDialogues:records.length,passedDialogues:records.filter(c=>c.passed).length,failedDialogues:records.filter(c=>!c.passed).length,modelCalls:calls,passedTurns,fixturePassedDialogues:baseline.filter(c=>c.passed).length,medianRequestMs:sorted.length?sorted[Math.floor(sorted.length/2)]:null,p95RequestMs:sorted.length?sorted[Math.min(sorted.length-1,Math.ceil(sorted.length*.95)-1)]:null},records},null,2));}
 for(const c of cases){
  const record={id:c.id,group:c.group,passed:true,turns:[] as unknown[],memory:memory()};records.push(record);
  for(let i=0;i<c.turns.length;i++){
   const messages=c.turns.slice(0,i+1).map(t=>t.text),traces:unknown[]=[],started=performance.now();let answer:Answer|undefined,error:string|undefined,errors:string[]=[];
   try{calls++;const patches=await ollamaExtractHistory(messages,{}, {onTrace:t=>traces.push(t)});let k=0;answer=await converse(messages,c.profile,async()=>patches[k++],'ollama');errors=check(answer,c.turns[i].expected);}catch(e){error=e instanceof Error?e.message:String(e);errors=[error];}
   const elapsedMs=performance.now()-started;elapsed.push(elapsedMs);if(!errors.length)passedTurns++;else record.passed=false;
   record.turns.push({turn:i+1,messages,expected:c.turns[i].expected,answer,error,errors,elapsedMs,traces});record.memory=memory();await save();console.log(`${c.id} ${i+1}/${c.turns.length}: ${errors.length?errors.join('; '):'passed'} (${Math.round(elapsedMs)}ms)`);
   if(error)break;
  }
 }
 for(const [name,hash] of Object.entries(code))if(createHash('sha256').update(await readFile(name)).digest('hex')!==hash)throw new Error('Code changed during evaluation');
 finished=true;await save();console.log(`Completed: ${records.filter(c=>c.passed).length}/20 dialogues passed. Fixture: ${baseline.filter(c=>c.passed).length}/20. Failures retained.`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
