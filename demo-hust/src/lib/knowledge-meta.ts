export type KnowledgeMeta={id:string;version:string;kind:'synthetic_fixture'|'provided_document'};
export const fixtureKnowledge:KnowledgeMeta={id:'t6-fixture',version:'1',kind:'synthetic_fixture'};
export class KnowledgeConfigurationError extends Error{
 constructor(){super('Bộ nguồn được chọn chưa được kiểm tra và kích hoạt. Không có hướng dẫn mới được tạo.');}
}
// Receipt and successful parsing are not source approval.
export function activeKnowledge(value=process.env.HUST_KNOWLEDGE_PACK):KnowledgeMeta{
 if(value&&value!==fixtureKnowledge.id)throw new KnowledgeConfigurationError();
 return {...fixtureKnowledge};
}
