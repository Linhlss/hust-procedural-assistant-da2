import type { Answer,ClarificationField,Facts } from '../src/lib/types';
export type AuditCase={id:string;issue:string;messages:string[];facts?:Partial<Facts>;absent?:(keyof Facts)[];question:ClarificationField|null;noConclusions?:boolean;pending?:Partial<Facts>;noPending?:boolean;contains?:string;statuses?:Record<string,string>;noSources?:string[]};
const full='Hội thảo tại Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
const unit='Công tác tại Hà Nội ngày 15/11/2026, chỉ dùng kinh phí đơn vị.';
const another='Một hội thảo khác ở Nhật Bản thì sao?';
export const auditCases:AuditCase[]=[
 {id:'R01-a',issue:'R01',messages:['Hội thảo tại Hà Nội ngày 15/11/2026, dùng kinh phí nhiệm vụ, không dùng kinh phí đơn vị, có phục vụ nhiệm vụ.'],facts:{funding:'task'},question:null,noSources:['SIM-DV']},
 {id:'R01-b',issue:'R01',messages:['Hội thảo tại Hà Nội ngày 15/11/2026, không dùng kinh phí nhiệm vụ mà dùng kinh phí đơn vị.'],facts:{funding:'unit'},question:null,noSources:['SIM-NV']},
 {id:'R01-c',issue:'R01',messages:[unit,'Không dùng kinh phí đơn vị nữa.'],absent:['funding'],question:'funding'},
 {id:'R01-d',issue:'R01',messages:['Không sử dụng kinh phí đơn vị; hội thảo trong nước ngày 15/11/2026 dùng kinh phí đề tài và phục vụ nhiệm vụ.'],facts:{funding:'task'},question:null},
 {id:'R01-e',issue:'R01',messages:['Tôi đi hội thảo cùng đơn vị chủ trì đề tài.'],absent:['funding'],question:'funding'},
 {id:'R01-g',issue:'R01',messages:[full,'Tôi dùng nguồn nhiệm vụ hoặc đơn vị, chưa chốt.'],absent:['funding'],question:'funding'},
 {id:'R01-f',issue:'R01',messages:[full,'Tôi dùng nguồn nhiệm vụ hay nguồn đơn vị, chưa rõ nguồn nào.'],absent:['funding'],question:'funding'},
 {id:'R01-h',issue:'R01',messages:[full,'Không dùng cả kinh phí nhiệm vụ và đơn vị.'],absent:['funding'],question:'funding'},
 {id:'R01-i',issue:'R01',messages:[unit,'Nguồn nhiệm vụ thay thế hoàn toàn nguồn đơn vị, hoạt động có phục vụ nhiệm vụ.'],facts:{funding:'task',related:true},question:null,noSources:['SIM-DV']},
 {id:'R02-a',issue:'R02',messages:['Tôi muốn hỏi điều kiện gia hạn đề tài.'],question:null,noConclusions:true,contains:'gia hạn'},
 {id:'R02-b',issue:'R02',messages:['Đăng ký nhiệm vụ nghiên cứu cần giấy tờ gì?'],question:null,noConclusions:true,contains:'đăng ký'},
 {id:'R02-c',issue:'R02',messages:['Hồ sơ nghiệm thu đề tài cần gì?'],question:null,noConclusions:true,contains:'nghiệm thu'},
 {id:'R02-d',issue:'R02',messages:['Điều kiện cử đi đào tạo nghiên cứu ở nước ngoài?'],question:null,noConclusions:true,contains:'đào tạo'},
 {id:'R02-e',issue:'R02',messages:['Không hỏi gia hạn đề tài, tôi muốn đi hội thảo.'],question:'funding',facts:{activity:'conference'}},
 {id:'R02-f',issue:'R02',messages:['Tôi cần đi hội thảo và gia hạn đề tài.'],question:null,noConclusions:true,contains:'gia hạn'},
 {id:'R03-a',issue:'R03',messages:[full,another],question:'situationRelation',facts:{location:'domestic',date:'2026-11-15',funding:'task'},pending:{location:'foreign',activity:'conference'}},
 {id:'R03-b',issue:'R03',messages:[full,another,'Đây là tình huống mới.'],question:'funding',facts:{location:'foreign',activity:'conference'},absent:['date','funding','related'],noPending:true},
 {id:'R03-c',issue:'R03',messages:[full,another,'Tôi tiếp tục tình huống trước.'],question:null,facts:{location:'foreign',date:'2026-11-15',funding:'task'},noPending:true},
 {id:'R03-d',issue:'R03',messages:[full,'Tình huống mới: tôi đi công tác trong nước ngày 20-11-2026, chỉ dùng kinh phí đơn vị.'],question:null,facts:{activity:'work',funding:'unit',date:'2026-11-20'},absent:['related'],noPending:true},
 {id:'R03-e',issue:'R03',messages:[full,another,'Ngày 20/11/2026.','Đây là tình huống mới.'],question:'funding',facts:{location:'foreign',date:'2026-11-20'},absent:['funding','related']},
 {id:'R03-f',issue:'R03',messages:[full,'Một hội thảo khác ở Nhật Bản dùng nguồn đơn vị thì sao?','Tôi tiếp tục tình huống trước.'],question:'fundingRelation',facts:{location:'foreign'}},
 {id:'R03-g',issue:'R03',messages:[full,'Một hội thảo khác ở Nhật Bản chỉ dùng kinh phí đơn vị thì sao?','Đây là tình huống mới.'],question:'date',facts:{location:'foreign',funding:'unit'},absent:['date','related']},
 {id:'R03-h',issue:'R03',messages:[full,'Tôi là giảng viên, muốn tham dự hội thảo thì cần làm gì?','Đây là tình huống mới.'],question:'funding',facts:{activity:'conference'},absent:['funding','date','related']},
 {id:'R04-a',issue:'R04',messages:[full,'Không phải đi hội thảo, tôi đi công tác tại Hà Nội ngày 15/11/2026.'],facts:{activity:'work'},question:null},
 {id:'R04-b',issue:'R04',messages:[unit,'Không phải công tác mà là hội thảo.'],facts:{activity:'conference'},question:null},
 {id:'R04-c',issue:'R04',messages:[full,'Chưa rõ đi hội thảo hay công tác.'],absent:['activity'],question:'activity'},
 {id:'R05-a',issue:'R05',messages:['Hội thảo tại Hà Nội ngày 15-11-2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.'],facts:{date:'2026-11-15'},question:null},
 {id:'R05-b',issue:'R05',messages:['Hội thảo trong nước ngày 29-02-2026, chỉ dùng kinh phí đơn vị.'],absent:['date'],question:'date'},
 {id:'R05-c',issue:'R05',messages:[full,'Sửa ngày thành 31-02-2026.'],absent:['date'],question:'date',statuses:{common:'insufficient'}},
 {id:'R05-d',issue:'R05',messages:[full,'Không phải ngày 15/11/2025 mà là 20-11-2026.'],facts:{date:'2026-11-20'},question:null},
 {id:'R05-e',issue:'R05',messages:[full,'Ngày 15/11/2026 hoặc 20/11/2026, tôi chưa chốt.'],absent:['date'],question:'date'},
 {id:'R05-f',issue:'R05',messages:[full,'Sửa ngày sang tháng sau.'],absent:['date'],question:'date'},
 {id:'R06-a',issue:'R06',messages:['Tôi muốn hỏi về việc mượn sách.'],question:null,noConclusions:true},
 {id:'R06-b',issue:'R06',messages:['Tôi muốn đi hội thảo.','Tôi cần hỏi về nghiệm thu đề tài.'],question:null,noConclusions:true,contains:'nghiệm thu'}
];
export function auditErrors(c:AuditCase,a:Answer):string[]{
 const errors:string[]=[];
 for(const [k,v] of Object.entries(c.facts??{}))if(a.facts[k as keyof Facts]!==v)errors.push(`facts.${k}: expected ${v}, got ${a.facts[k as keyof Facts]}`);
 for(const k of c.absent??[])if(a.facts[k]!==undefined)errors.push(`facts.${k} must be absent`);
 if((a.clarification?.field??null)!==c.question)errors.push(`question: expected ${c.question}, got ${a.clarification?.field??null}`);
 if(c.noConclusions&&a.conclusions.length)errors.push('unsupported/unknown request produced conclusions');
 if(c.contains&&!a.text.includes(c.contains))errors.push(`response must mention ${c.contains}`);
 for(const [k,v] of Object.entries(c.pending??{}))if(a.pendingSituation?.[k as keyof Facts]!==v)errors.push(`pending.${k}: expected ${v}`);
 if(c.noPending&&a.pendingSituation)errors.push('pending situation must be resolved');
 for(const [id,status] of Object.entries(c.statuses??{}))if(a.conclusions.find(x=>x.id===id)?.status!==status)errors.push(`conclusion ${id}: expected ${status}`);
 for(const prefix of c.noSources??[])if(a.conclusions.flatMap(x=>x.sources).some(s=>s.id.startsWith(prefix)))errors.push(`unexpected sources ${prefix}`);
 return errors;
}
