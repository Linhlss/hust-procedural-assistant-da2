import { mkdir,writeFile } from 'node:fs/promises';
import { converse } from '../src/lib/engine';
import { auditCases,auditErrors } from '../tests/robustness-cases';
import type { Answer } from '../src/lib/types';
const base=process.env.DEMO_BASE_URL,baseline=process.env.AUDIT_BASELINE==='1';
const dir=process.env.HUST_TEST_ARTIFACT_DIR??'artifacts/demo-runs/robustness-local-2026-10-28';
async function main(){
const records=[];
for(const c of auditCases){let answer:Answer;if(base){const r=await fetch(`${base}/api/chat`,{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({messages:c.messages,profile:'standard',requestId:c.id})});if(!r.ok)throw new Error(`${c.id}: HTTP ${r.status}`);answer=(await r.json()).answer;}else answer=await converse(c.messages);const errors=auditErrors(c,answer);records.push({...c,answer,errors,status:errors.length?'failed':'passed'});}
await mkdir(dir,{recursive:true});await writeFile(`${dir}/${baseline?'baseline':'robustness'}-transcripts.json`,JSON.stringify({at:new Date().toISOString(),base:base??'local engine',mode:'fixture',baseline,status:records.some(r=>r.errors.length)?'failed':'passed',passed:records.filter(r=>!r.errors.length).length,total:records.length,records},null,2));
console.log(`${baseline?'Baseline':'Robustness'}: ${records.filter(r=>!r.errors.length).length}/${records.length} cases passed.`);
if(!baseline&&records.some(r=>r.errors.length)){for(const r of records.filter(r=>r.errors.length))console.error(r.id,r.errors);process.exitCode=1;}

}
main().catch(error=>{console.error(error);process.exitCode=1;});
