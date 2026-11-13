import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {knowledgePackSchema,packReadiness,retrieveSections,type KnowledgeUse} from '../src/lib/knowledge-pack';
async function main(){
const [command,path,text,...flags]=process.argv.slice(2);
if(!['validate','search'].includes(command)||!path)throw new Error('Usage: knowledge-tools.ts validate PACK | search PACK QUERY [--date YYYY-MM-DD] [--use research|quotation|model|public]');
const parsed=knowledgePackSchema.safeParse(JSON.parse(await readFile(path,'utf8')));
if(!parsed.success){console.log(JSON.stringify({valid:false,issues:parsed.error.issues},null,2));process.exitCode=2;}
else if(command==='validate'){
 const originalLinks=[];
 for(const d of parsed.data.documents){
  if(!d.originalRef){originalLinks.push({documentId:d.id,checked:false,exists:false,reason:'Chưa có liên kết bản gốc'});continue;}
  if(/^https?:/.test(d.originalRef)){originalLinks.push({documentId:d.id,checked:false,exists:null,reason:'Liên kết mạng chưa xác minh, không tự tải'});continue;}
  let exists=false;try{exists=(await stat(resolve(dirname(path),d.originalRef))).isFile();}catch{}
  originalLinks.push({documentId:d.id,checked:true,exists});
 }
 console.log(JSON.stringify({valid:true,originalLinks,...Object.fromEntries((['research','quotation','model','public'] as KnowledgeUse[]).map(use=>[use,packReadiness(parsed.data,use)])),runtimeActivated:false},null,2));
 if(originalLinks.some(l=>l.checked&&!l.exists))process.exitCode=2;
}
else{
 const value=(flag:string)=>{const i=flags.indexOf(flag);return i<0?undefined:flags[i+1];};
 const use=value('--use')??'research';if(!['research','quotation','model','public'].includes(use))throw new Error('Unknown intended use');
 console.log(JSON.stringify(retrieveSections(parsed.data,{text:text??'',date:value('--date'),use:use as KnowledgeUse}),null,2));
}

}
main().catch(error=>{console.error(error instanceof Error?error.message:String(error));process.exitCode=1;});
