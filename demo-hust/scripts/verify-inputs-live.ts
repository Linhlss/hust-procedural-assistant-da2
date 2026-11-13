import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {editMessage,declaredState} from '../src/lib/fact-edits';
import type {FactEdit,RecordedInput} from '../src/lib/input-schema';
import type {Answer} from '../src/lib/types';
async function main(){
 const base=process.env.DEMO_BASE_URL!,dir=process.env.HUST_TEST_ARTIFACT_DIR!;assert.ok(base&&dir);await mkdir(dir,{recursive:true});const records:unknown[]=[];
 async function ask(id:string,body:object,status=200){const start=performance.now(),r=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({...body,requestId:id})}),data=await r.json();records.push({id,request:structuredClone(body),httpStatus:r.status,elapsedMs:performance.now()-start,response:data});await writeFile(dir+'/input-api-transcripts.json',JSON.stringify({base,anonymous:true,records},null,2));assert.equal(r.status,status);if(status===200){assert.equal(data.answer.mode,'fixture');assert.equal(data.requestId,id);}else assert.equal(data.answer,undefined);return data as {answer:Answer;inputs:RecordedInput[]};}
 let messages:string[]=[],inputs:RecordedInput[]=[];let last:Answer|undefined;
 async function edit(e:FactEdit){messages.push(editMessage(e));const r=await ask('E'+messages.length,{messages,inputs,edit:e,profile:'standard'});inputs=r.inputs;last=r.answer;assert.equal(last.inputMethod,'fact-edit');assert.equal(inputs.length,messages.length);return last;}
 await edit({field:'activity',value:'conference'});await edit({field:'location',value:'domestic'});await edit({field:'date',value:'2026-11-15'});await edit({field:'funding',value:'task'});await edit({field:'related',value:true});assert.equal(last!.conclusions.find(c=>c.id==='task')?.status,'meets');
 const old=last!;await edit({field:'funding',value:'unit'});assert.equal(last!.conclusions.some(c=>c.id==='task'),false);await edit({field:'funding',value:'combined'});await edit({field:'allocation',value:true});assert.equal(last!.conclusions.find(c=>c.id==='unit')?.status,'meets');await edit({field:'allocation',value:null});assert.equal(last!.facts.allocation,undefined);await edit({field:'date',value:null});assert.equal(last!.facts.date,undefined);
 await ask('invalid-day',{messages:['x'],inputs:[],edit:{field:'date',value:'2026-02-31'}},400);
 const e:FactEdit={field:'funding',value:'unit'};const restored={kind:'restore',state:declaredState(old)};
 const missing=await ask('missing-unit',{messages:['Dữ kiện đã khai báo.',editMessage(e)],inputs:[restored],edit:e,profile:'missing-unit'});assert.equal(missing.answer.conclusions.find(c=>c.id==='unit')?.status,'insufficient');
 await ask('reject-client-conclusions',{messages:['a','b'],inputs:[{kind:'restore',state:{facts:{},conclusions:[{status:'meets'}]}}]},400);
 await writeFile(dir+'/input-api-summary.json',JSON.stringify({requests:records.length,passed:records.length,anonymous:true,model:'fixture',policyValidation:false},null,2));console.log('Verified',records.length,'anonymous typed-input requests');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
