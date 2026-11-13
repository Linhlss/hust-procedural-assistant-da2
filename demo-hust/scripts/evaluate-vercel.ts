import {spawn} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {checkExpected,expectedState,unexpectedFacts,reviewDimensions,type Expected} from '../src/lib/evaluation';
import type {Answer,Facts,Profile,ChatMode} from '../src/lib/types';
import type {RecordedInput} from '../src/lib/input-schema';
type Case={id:string;group:string;split?:string;profile:Profile;turns:{text:string;expected:Expected;rubric?:{must_address:string[];must_not_claim:string[]}}[]};
async function callChat(url:URL,payload:unknown):Promise<Response>{
 if((process.env.EVAL_TRANSPORT??'fetch')==='fetch')return fetch(new URL('/api/chat',url),{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(59000),body:JSON.stringify(payload)});
 if(process.env.EVAL_TRANSPORT!=='vercel-cli'||process.env.ALLOW_VERCEL_AUTOMATION!=='1')throw new Error('Private deployment transport requires explicit Automation approval');
 const deployment=process.env.EVAL_DEPLOYMENT_ID;if(!deployment?.startsWith('dpl_'))throw new Error('Protected evaluation requires verified deployment ID');
 const project=JSON.parse(await readFile('.vercel/project.json','utf8'));if(project.projectId!=='prj_oV7GrrsI5vz4UpMb6kKnuUfAxoIF')throw new Error('Wrong Vercel project');
 const cli=process.env.VERCEL_CLI_PATH??'vercel',args=['curl','/api/chat','--deployment',deployment,'--','--request','POST','--header','Content-Type: application/json','--data-binary','@-','--silent','--show-error','--max-time','59','--write-out','\\n%{http_code}'];
 const result=await new Promise<string>((resolve,reject)=>{
  const child=spawn(cli.endsWith('.js')?process.execPath:cli,cli.endsWith('.js')?[cli,...args]:args,{stdio:['pipe','pipe','pipe']});let stdout='';
  const timeout=setTimeout(()=>{child.kill('SIGTERM');reject(new Error('Vercel CLI request timed out'));},75000);
  child.stdout.on('data',chunk=>{stdout+=chunk;});child.stderr.on('data',()=>{}); // Never persist CLI auth headers or tokens.
  child.on('error',()=>{clearTimeout(timeout);reject(new Error('Cannot start Vercel CLI'));});
  child.on('close',code=>{clearTimeout(timeout);if(code!==0)reject(new Error('Vercel CLI request failed, exit '+code));else resolve(stdout);});child.stdin.end(JSON.stringify(payload));
 });
 const index=result.lastIndexOf('\n'),status=Number(result.slice(index+1).trim());if(!Number.isInteger(status)||status<100||status>599)throw new Error('Vercel CLI did not return HTTP status');
 return new Response(result.slice(0,index),{status});
}
async function main(){
 const base=process.env.PLAYWRIGHT_BASE_URL,dir=process.env.HUST_TEST_ARTIFACT_DIR,mode=process.env.EXPECTED_CHAT_MODE as ChatMode|undefined;
 if(!base||!dir||!mode)throw new Error('Set public HTTPS PLAYWRIGHT_BASE_URL, unique HUST_TEST_ARTIFACT_DIR and EXPECTED_CHAT_MODE');
 const url=new URL(base);if(url.protocol!=='https:'||['localhost','127.0.0.1','[::1]'].includes(url.hostname))throw new Error('Evaluation must target HTTPS Vercel, never local');
 if(!['gemini','fixture'].includes(mode))throw new Error('Only Gemini/fixture Vercel evaluation supported');
 const suite=process.env.EVAL_SUITE??'context',split=process.env.EVAL_SPLIT??'development';
 if(!['week7','context','legacy','validation','verification','release','safety','control','final','contact','rate'].includes(suite)||!['development','heldout','all'].includes(split))throw new Error('Invalid suite/split');
 const path=suite==='week7'?'tests/week7-development-cases.json':suite==='rate'?'tests/gemini-rate-cases.json':suite==='contact'?'tests/gemini-contact-cases.json':suite==='final'?'tests/gemini-final-cases.json':suite==='control'?'tests/gemini-control-cases.json':suite==='safety'?'tests/gemini-safety-cases.json':suite==='release'?'tests/gemini-release-cases.json':suite==='verification'?'tests/gemini-verification-cases.json':suite==='validation'?'tests/gemini-validation-cases.json':suite==='context'?'tests/context-cases.json':'tests/ollama-cases.json',bytes=await readFile(path),sha=createHash('sha256').update(bytes).digest('hex');
 const expectedSha=suite==='week7'?JSON.parse(await readFile('tests/week7-development-cases.manifest.json','utf8')).sha256:suite==='rate'?JSON.parse(await readFile('tests/gemini-rate-cases.manifest.json','utf8')).sha256:suite==='contact'?JSON.parse(await readFile('tests/gemini-contact-cases.manifest.json','utf8')).sha256:suite==='final'?JSON.parse(await readFile('tests/gemini-final-cases.manifest.json','utf8')).sha256:suite==='control'?JSON.parse(await readFile('tests/gemini-control-cases.manifest.json','utf8')).sha256:suite==='safety'?JSON.parse(await readFile('tests/gemini-safety-cases.manifest.json','utf8')).sha256:suite==='release'?JSON.parse(await readFile('tests/gemini-release-cases.manifest.json','utf8')).sha256:suite==='verification'?JSON.parse(await readFile('tests/gemini-verification-cases.manifest.json','utf8')).sha256:suite==='validation'?JSON.parse(await readFile('tests/gemini-validation-cases.manifest.json','utf8')).sha256:suite==='context'?JSON.parse(await readFile('tests/context-cases.manifest.json','utf8')).sha256:'f6bc5a0f27c3585c9eae303d59e91e04a994217f3c59d9e2b4945e9bb724046e';if(sha!==expectedSha)throw new Error('Frozen cases changed');
 const all=(JSON.parse(bytes.toString()) as {cases:Case[]}).cases,cases=all.filter(c=>suite==='legacy'||split==='all'||c.split===split).filter(c=>!process.env.EVAL_CASE_IDS||process.env.EVAL_CASE_IDS.split(',').includes(c.id));
 if(process.env.EVAL_CASE_IDS&&cases.length!==new Set(process.env.EVAL_CASE_IDS.split(',')).size)throw new Error('Unknown or duplicate case filter');
 await mkdir(dir,{recursive:true});
 const code:Record<string,string>={};for(const name of ['src/lib/gemini.ts','src/lib/gemini-extraction.ts','src/lib/narrative-grounding.ts','src/lib/answer-coverage.ts','src/lib/conversation-inputs.ts','src/lib/engine.ts','src/lib/extractor.ts','scripts/evaluate-vercel.ts'])code[name]=createHash('sha256').update(await readFile(name)).digest('hex');
 const target={code,url:url.origin,transport:process.env.EVAL_TRANSPORT??'fetch',deploymentId:process.env.EVAL_DEPLOYMENT_ID??null,mode,suite,split,caseFilter:process.env.EVAL_CASE_IDS??null,cohortSha256:sha,startedAt:new Date().toISOString(),policyValidation:false,manualReviewComplete:false};
 const file=`${dir}/${suite}-${split}-${mode}.json`;let saved: {target:typeof target;records:Record<string,unknown>[];complete?:boolean}|undefined;
 try{saved=JSON.parse(await readFile(file,'utf8'));}catch{}
 if(saved&&JSON.stringify({...saved.target,startedAt:null})!==JSON.stringify({...target,startedAt:null}))throw new Error('Cannot resume different target/config');
 const records=(saved?.records??[]) as {id:string;group:string;split?:string;turns:{turn:number;text:string;expected:Expected;answer?:Answer;inputs?:RecordedInput[];error?:unknown;legacyErrors?:string[];strictErrors?:string[];elapsedMs:number;rubric?:unknown;manualReview:Record<string,null>;skipped?:boolean}[]}[];
 let paused=false;
 async function save(complete=false){await writeFile(file,JSON.stringify({target:saved?.target??target,updatedAt:new Date().toISOString(),complete,paused,summary:{plannedDialogues:cases.length,plannedTurns:cases.reduce((n,c)=>n+c.turns.length,0),successfulResponses:records.reduce((n,c)=>n+c.turns.filter(t=>t.answer).length,0),manualReviewComplete:false},records},null,2));}
 const waitMs=Number(process.env.EVAL_INTERVAL_MS??15000);if(!Number.isFinite(waitMs)||waitMs<0||waitMs>60000)throw new Error('Invalid interval');
 for(const c of cases){let record=records.find(r=>r.id===c.id);if(!record){record={id:c.id,group:c.group,split:c.split,turns:[]};records.push(record);}
  let inputs:RecordedInput[]=[],declared:Facts={};
  for(let i=0;i<c.turns.length;i++){
   const t=c.turns[i];declared=expectedState(declared,t.expected);const old=record.turns.find(x=>x.turn===i+1);
   if(old){if(old.answer)inputs=old.inputs??[];continue;} // Resume quota pauses only; never overwrite a recorded failure.
   if(record.turns.some(x=>x.turn<i+1&&!x.answer)){record.turns.push({turn:i+1,text:t.text,expected:t.expected,error:'Not run: previous turn failed',skipped:true,elapsedMs:0,manualReview:Object.fromEntries(reviewDimensions.map(k=>[k,null]))});continue;}
   const started=performance.now();let answer:Answer|undefined,error:unknown,status=0,body;
   try{
    const response=await callChat(url,{messages:c.turns.slice(0,i+1).map(t=>t.text),profile:c.profile,requestId:`${c.id}-${i+1}`,inputs});status=response.status;body=await response.json();
    if(status===429){paused=true;await writeFile(`${dir}/quota-pause.json`,JSON.stringify({at:new Date().toISOString(),case:c.id,turn:i+1,status,body,retryAfter:response.headers.get('retry-after')},null,2));await save();console.log('Paused: free quota/rate limit. No automatic retry or paid fallback.');return;}
    if(!response.ok)error={status,body};else if(body.requestId!==`${c.id}-${i+1}`)throw new Error('Wrong request ID from target');else if(body.answer?.mode!==mode)throw new Error(`Wrong adapter: expected ${mode}, got ${body.answer?.mode}`);else{answer=body.answer;inputs=body.inputs;}
   }catch(e){error={status,message:e instanceof Error?e.message:String(e),body};}
   const entry={turn:i+1,text:t.text,expected:t.expected,answer,inputs:answer?inputs:undefined,error,elapsedMs:performance.now()-started,legacyErrors:answer?checkExpected(answer,t.expected):undefined,strictErrors:answer?[...checkExpected(answer,t.expected),...unexpectedFacts(answer.facts,declared)]:undefined,rubric:t.rubric,manualReview:Object.fromEntries(reviewDimensions.map(k=>[k,null]))};
   record.turns=record.turns.filter(x=>x.turn!==i+1);record.turns.push(entry);await save();console.log(`${c.id}/${i+1}: ${error?'ERROR':entry.strictErrors?.join('; ')||'automatic checks passed'}; content review pending`);
   if(waitMs)await new Promise(r=>setTimeout(r,waitMs));
  }
 }
 await save(true);
}
main().catch(e=>{console.error(e instanceof Error?e.message:String(e));process.exitCode=1;});
