import {test} from 'node:test';
import assert from 'node:assert/strict';
import {knowledgePackSchema,packReadiness,retrieveSections,type KnowledgePack} from '../src/lib/knowledge-pack';
function pack():KnowledgePack{
 const allowed={state:'allowed' as const,evidence:'Synthetic test permission, not HUST data'};
 return {schemaVersion:1,id:'test-received',version:'1',kind:'provided_document',documents:[{
  id:'DOC-1',title:'Giấy tờ hội thảo',domain:'TCKH',version:'test-2026',sourceStatus:'verified_original',originalRef:'test-only.pdf',
  dates:{from:'2026-01-01',to:null,verified:true,evidence:'Synthetic test date evidence'},
  applicability:{cards:['T6'],funding:['task'],subjects:[],taskTypes:[],units:[],verified:true,evidence:'Synthetic test scope evidence'},
  permissions:{research:allowed,quotation:allowed,model:{state:'unknown',evidence:null},public:{state:'unknown',evidence:null}},
  sections:[{id:'s1',sourceId:'TEST-QUOTE-1',title:'Giấy mời',text:'Trước khi đi, chuẩn bị giấy mời theo hướng dẫn thử.',reviewed:true,location:{page:2,heading:'Mục thử'}}],
 }],adviceCards:[{id:'ADVICE-1',card:'T6',question:'Cần giấy tờ gì?',factFields:['activity'],sourceIds:['TEST-QUOTE-1'],guidance:'Hướng dẫn thử',stopRule:'Thiếu nguồn thì dừng',verification:'confirmed',confirmationEvidence:'Synthetic review'}]};
}
test('received pack preserves unknown dates and rights; parsing never activates it',()=>{
 const p=pack();p.documents[0].dates={from:null,to:null,verified:false,evidence:null};p.documents[0].sourceStatus='unverified_original';
 const parsed=knowledgePackSchema.parse(p);
 assert.equal(parsed.documents[0].dates.from,null);
 assert.equal(packReadiness(parsed,'model').ready,false);
 assert.equal(packReadiness(parsed,'public').ready,false);
});
test('source checker rejects duplicate fragments, missing citations, invalid dates and mixed fixture sources',()=>{
 for(const modify of [
  (p:KnowledgePack)=>{p.documents[0].sections.push({...p.documents[0].sections[0]});},
  (p:KnowledgePack)=>{p.adviceCards[0].sourceIds=['DOES-NOT-EXIST'];},
  (p:KnowledgePack)=>{p.documents[0].dates.from='2026-02-31';},
  (p:KnowledgePack)=>{p.documents[0].dates.to='2025-12-31';},
  (p:KnowledgePack)=>{p.documents[0].sections[0].location={page:null,heading:null};},
  (p:KnowledgePack)=>{p.documents[0].sections[0].text=' ';},
  (p:KnowledgePack)=>{p.documents[0].sections[0].sourceId='SIM-PRETENDING-TO-BE-OFFICIAL';},
  (p:KnowledgePack)=>{p.documents[0].permissions.model={state:'allowed',evidence:null};},
 ]){
  const p=pack();modify(p);assert.equal(knowledgePackSchema.safeParse(p).success,false);
 }
});
test('retrieval respects date, funding and separate permissions while preserving exact source position',()=>{
 const p=knowledgePackSchema.parse(pack());
 const q={text:'giay moi',date:'2026-11-18',card:'T6' as const,funding:'task' as const};
 const result=retrieveSections(p,q);
 assert.equal(result.results[0].sourceId,'TEST-QUOTE-1');
 assert.deepEqual(result.results[0].location,{page:2,heading:'Mục thử'});
 assert.equal(result.policyConclusion,false);
 assert.equal(retrieveSections(p,{...q,date:'2025-12-31'}).results.length,0);
 assert.equal(retrieveSections(p,{...q,funding:'unit'}).results.length,0);
 assert.equal(retrieveSections(p,{...q,use:'model'}).results.length,0);
 assert.equal(retrieveSections(p,{...q,use:'public'}).results.length,0);
 assert.throws(()=>retrieveSections(p,{...q,date:'2026-02-31'}));
});
test('a found quote never implies advice approval or permission for a different use',()=>{
 const p=pack();p.adviceCards[0].verification='pending';p.adviceCards[0].confirmationEvidence=null;
 assert.equal(retrieveSections(p,{text:'giấy mời'}).results.length,1);
 assert.equal(packReadiness(p,'research').ready,false);
 assert.equal(packReadiness(p,'model').ready,false);
});
