import {z} from 'zod';
export const factKeys=['activity','location','date','funding','related','allocation'] as const;
export const isValidDate=(date:string)=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;
export const factsSchema=z.object({activity:z.enum(['conference','work']).optional(),location:z.enum(['domestic','foreign']).optional(),date:z.string().refine(isValidDate,'Ngày không hợp lệ').optional(),funding:z.enum(['task','unit','combined']).optional(),related:z.boolean().optional(),allocation:z.boolean().optional()}).strict();
export const factEditSchema=z.discriminatedUnion('field',[
 z.object({field:z.literal('activity'),value:z.enum(['conference','work'])}).strict(),
 z.object({field:z.literal('location'),value:z.enum(['domestic','foreign'])}).strict(),
 z.object({field:z.literal('date'),value:z.string().refine(isValidDate,'Ngày không hợp lệ').nullable()}).strict(),
 z.object({field:z.literal('funding'),value:z.enum(['task','unit','combined'])}).strict(),
 z.object({field:z.literal('related'),value:z.boolean().nullable()}).strict(),
 z.object({field:z.literal('allocation'),value:z.boolean().nullable()}).strict(),
]);
export type FactEdit=z.infer<typeof factEditSchema>;
const patch=z.object({intent:z.enum(['consult','out','unknown','unsupported']),unsupportedTopic:z.enum(['registration','extension','acceptance','training']).optional(),...factsSchema.shape,fundingAction:z.enum(['replace','combine','unclear']).optional(),topic:z.enum(['documents','steps','timing','sources']).optional(),personal:z.boolean().optional(),general:z.boolean().optional(),declined:z.boolean().optional(),ambiguous:z.boolean().optional(),newSituation:z.boolean().optional(),sameSituation:z.boolean().optional(),situationUnclear:z.boolean().optional(),pendingSituationAction:z.enum(['replace','combine','unclear']).optional(),clear:z.array(z.enum(factKeys)).max(6).optional()}).strict().superRefine((p,c)=>{
 if(Number(!!p.newSituation)+Number(!!p.sameSituation)+Number(!!p.situationUnclear)>1)c.addIssue({code:'custom',message:'Mâu thuẫn tình huống'});
 if(p.clear?.some(k=>p[k]!==undefined))c.addIssue({code:'custom',message:'Vừa xóa vừa gán dữ kiện'});
 if(p.ambiguous&&!p.clear?.length)c.addIssue({code:'custom',message:'Thiếu trường cần làm rõ'});
 if(p.fundingAction==='combine'&&p.funding!=='combined')c.addIssue({code:'custom',message:'Sai nguồn kết hợp'});
 if(p.pendingSituationAction&&!p.situationUnclear)c.addIssue({code:'custom',message:'Thiếu tình huống đang chờ'});
 if(p.intent==='unsupported'&&!p.unsupportedTopic)c.addIssue({code:'custom',message:'Thiếu nội dung ngoài phạm vi'});
});
export const declaredStateSchema=z.object({facts:factsSchema,pendingFunding:z.boolean().optional(),pendingSituation:factsSchema.optional(),pendingSituationAction:z.enum(['replace','combine','unclear']).optional(),declined:z.boolean().optional(),requestedTopic:z.enum(['documents','steps','timing','sources']).optional(),preparationOnly:z.boolean().optional(),consultation:z.boolean().optional()}).strict();
export const recordedInputSchema=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('message'),patch}).strict(),
 z.object({kind:z.literal('fact-edit'),edit:factEditSchema}).strict(),
 z.object({kind:z.literal('restore'),state:declaredStateSchema}).strict(),
 z.object({kind:z.literal('legacy')}).strict(),
]);
export type RecordedInput=z.infer<typeof recordedInputSchema>;
