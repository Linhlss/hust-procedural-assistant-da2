import {validateNarrative} from './gemini';
import {replayRecordedInputs} from './conversation-inputs';
import {checkExpected,expectedState,unexpectedFacts,type Expected} from './evaluation';
import type {Answer,Facts,Profile} from './types';
import type {RecordedInput} from './input-schema';
export type SavedTurn={turn:number;text:string;expected:Expected;answer?:Answer;inputs?:RecordedInput[];error?:unknown;skipped?:boolean};
export type SavedCase={id:string;profile?:Profile;turns:SavedTurn[]};
export async function replaySavedCases(cases:SavedCase[],profiles:Record<string,Profile>={}){
 const rows:{id:string;turn:number;recordedResponse:boolean;engine:'pass'|'fail'|'not_replayable';engineErrors:string[];narrative:'accepted'|'rejected'|'not_recorded';rejectionReason?:string;originalError?:{status?:number;code?:string;skipped:boolean}}[]=[];
 for(const c of cases){
  let declared:Facts={};
  for(const t of c.turns){
   declared=expectedState(declared,t.expected);
   const error=t.error as {status?:unknown;body?:{code?:unknown}}|undefined;
   const safeError=error?{...(typeof error.status==='number'?{status:error.status}:{}),...(typeof error.body?.code==='string'&&/^[A-Z0-9_]{1,64}$/.test(error.body.code)?{code:error.body.code}:{}),skipped:!!t.skipped}:undefined;
   const row:typeof rows[number]={id:c.id,turn:t.turn,recordedResponse:!!t.answer,engine:'not_replayable',engineErrors:[],narrative:'not_recorded',...(safeError?{originalError:safeError}:{})};
   if(t.answer&&t.inputs){
    try{
     const messages=c.turns.filter(x=>x.turn<=t.turn).map(x=>x.text);
     const answer=await replayRecordedInputs(messages,t.inputs,c.profile??t.answer.profile??profiles[c.id]??'standard');
     row.engineErrors=[...checkExpected(answer,t.expected),...unexpectedFacts(answer.facts,declared)];
     row.engine=row.engineErrors.length?'fail':'pass';
    }catch(e){row.engine='fail';row.engineErrors=[e instanceof Error?e.message:'Recorded input invalid'];}
   }
   if(t.answer?.narrative){
    try{validateNarrative({paragraphs:t.answer.narrative.paragraphs},t.answer);row.narrative='accepted';}
    catch(e){row.narrative='rejected';row.rejectionReason=(e as {reason?:string}).reason??'invalid_recorded_output';}
   }
   rows.push(row);
  }
 }
 return {kind:'offline_replay' as const,modelCalls:0,modelQualityReevaluated:false,rows,summary:{
  recordedTurns:rows.length,recordedResponses:rows.filter(r=>r.recordedResponse).length,
  enginePassed:rows.filter(r=>r.engine==='pass').length,engineFailed:rows.filter(r=>r.engine==='fail').length,notReplayable:rows.filter(r=>r.engine==='not_replayable').length,
  narrativesAccepted:rows.filter(r=>r.narrative==='accepted').length,narrativesRejected:rows.filter(r=>r.narrative==='rejected').length,
 }};
}
