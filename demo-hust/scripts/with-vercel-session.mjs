// Protection material stays in memory, never in evidence or CLI arguments.
import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
const project=JSON.parse(await readFile('.vercel/project.json','utf8'));
if(project.projectId!=='prj_oV7GrrsI5vz4UpMb6kKnuUfAxoIF'||process.env.ALLOW_VERCEL_AUTOMATION!=='1')throw new Error('Project Automation authorization required');
const cli=process.env.VERCEL_CLI_PATH,dep=process.env.EVAL_DEPLOYMENT_ID,base=process.env.PLAYWRIGHT_BASE_URL??process.env.DEMO_BASE_URL;
if(!cli||!dep?.startsWith('dpl_')||!base||!/^https:\/\/hust-t6-demo-[a-z0-9-]+\.vercel\.app$/.test(base))throw new Error('Use verified deployment ID and project Preview URL');
const output=await new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,[cli,'curl','/','--deployment',dep,'--','--silent','--show-error','--include','--header','x-vercel-set-bypass-cookie: true','--max-time','45'],{stdio:['ignore','pipe','ignore']});let text='';
 child.stdout.on('data',part=>text+=part);child.on('error',()=>reject(new Error('Cannot start authorized CLI')));child.on('close',code=>code===0?resolve(text):reject(new Error('Cannot obtain authorized test session')));
});
const cookies=[...output.matchAll(/^set-cookie:\s*([^;\r\n]+)/gim)].map(m=>m[1]);
if(!cookies.length)throw new Error('No test session cookie returned; no secret written');
const [cmd,...args]=process.argv.slice(2);if(!cmd)throw new Error('Supply command');
const child=spawn(cmd,args,{stdio:'inherit',env:{...process.env,HUST_TEST_COOKIE:cookies.join('; '),HUST_PROTECTED_TEST:'1'}});
child.on('error',()=>{console.error('Cannot start protected verification');process.exitCode=1;});child.on('close',code=>{process.exitCode=code??1;});
