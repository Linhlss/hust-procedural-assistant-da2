import type { Clarification,ClarificationField,Facts,Profile,Patch } from './types';
import { applicable } from './sources';
const prompts:Record<ClarificationField,{question:string;reason:string;choices:{label:string;message:string}[]}>= {
 situationRelation:{question:'Bạn đang tiếp tục tình huống trước hay bắt đầu một tình huống mới?',reason:'Tôi cần xác định điều này để không dùng lại ngày, địa điểm hoặc nguồn kinh phí cũ cho một trường hợp khác.',choices:[{label:'Tiếp tục tình huống trước',message:'Tôi tiếp tục tình huống trước.'},{label:'Tình huống mới',message:'Đây là một tình huống mới.'}]},
 activity:{question:'Bạn dự định tham dự hội thảo hay đi công tác?',reason:'Loại hoạt động giúp chọn đúng phần hướng dẫn.',choices:[{label:'Hội thảo',message:'Tôi dự định tham dự hội thảo.'},{label:'Công tác',message:'Tôi dự định đi công tác.'}]},
 funding:{question:'Bạn dự kiến sử dụng nguồn kinh phí nào?',reason:'Nguồn hỗ trợ quyết định cần đối chiếu hướng dẫn nhiệm vụ, đơn vị hay cả hai.',choices:[{label:'Kinh phí nhiệm vụ',message:'Tôi dùng kinh phí nhiệm vụ.'},{label:'Kinh phí đơn vị',message:'Tôi chỉ dùng kinh phí đơn vị.'},{label:'Kết hợp cả hai nguồn',message:'Tôi kết hợp cả kinh phí nhiệm vụ và kinh phí đơn vị.'}]},
 location:{question:'Hoạt động diễn ra trong nước hay nước ngoài?',reason:'Cần địa điểm thực tế để kiểm điều kiện áp dụng; “quốc tế” chưa xác định được địa điểm.',choices:[{label:'Trong nước',message:'Hoạt động diễn ra trong nước.'},{label:'Nước ngoài',message:'Hoạt động diễn ra ở nước ngoài.'}]},
 date:{question:'Hoạt động diễn ra ngày nào?',reason:'Ngày hoạt động giúp chọn đúng phiên bản tài liệu. Bạn có thể chọn ngày bên dưới hoặc nhập ngày/tháng/năm.',choices:[]},
 related:{question:'Hoạt động này có phục vụ nội dung của nhiệm vụ không?',reason:'Chỉ cần kiểm điều kiện này vì bạn đang sử dụng kinh phí nhiệm vụ.',choices:[{label:'Có phục vụ nhiệm vụ',message:'Hoạt động có phục vụ nhiệm vụ.'},{label:'Không phục vụ nhiệm vụ',message:'Hoạt động không phục vụ nhiệm vụ.'}]},
 allocation:{question:'Các nội dung hỗ trợ đã được phân định riêng cho từng nguồn chưa?',reason:'Nguồn kết hợp cần phân định nội dung, tránh đề nghị cùng một nội dung ở hai nguồn. Không cần cung cấp số tiền.',choices:[{label:'Đã phân định',message:'Các nội dung đã được phân định riêng cho từng nguồn.'},{label:'Chưa phân định',message:'Các nội dung chưa được phân định riêng cho từng nguồn.'}]},
 fundingRelation:{question:'Nguồn đơn vị thay thế hoàn toàn kinh phí nhiệm vụ hay hỗ trợ thêm?',reason:'Tôi cần biết có tiếp tục áp dụng điều kiện của nguồn nhiệm vụ hay không.',choices:[{label:'Thay thế hoàn toàn',message:'Nguồn đơn vị thay thế hoàn toàn kinh phí nhiệm vụ.'},{label:'Hỗ trợ thêm',message:'Đơn vị hỗ trợ thêm, kết hợp cả hai nguồn.'}]}
};
export function nextClarification(f:Facts,profile:Profile,pending:boolean,pendingSituation=false,topic?:Patch['topic']):Clarification|undefined{
 if(pendingSituation)return {field:'situationRelation',...prompts.situationRelation,remaining:['situationRelation'],collected:0,total:1};
 const required:ClarificationField[]=['activity','funding'];
 // Preparation depends on the activity, funding branch and applicable document period, not eligibility facts.
 if(topic&&topic!=='sources'){required.push('date');if(pending)required.unshift('fundingRelation');const missing=required.filter(k=>k==='fundingRelation'?pending:f[k as keyof Facts]===undefined);if(!missing.length)return undefined;const field=missing[0];return {field,...prompts[field],remaining:missing,collected:required.length-missing.length,total:required.length};}
 const dateSupported=!f.date||Boolean(applicable('SIM-NV-1',f.date,profile)||applicable('SIM-DV-1',f.date,profile)||applicable(f.date<'2026-01-01'?'SIM-CT-2025':'SIM-CT-2026',f.date,profile));
 if(dateSupported)required.push('location');required.push('date');
 if(f.funding!=='unit'&&f.funding&&applicable('SIM-NV-1',f.date,profile))required.push('related');
 if(f.funding==='combined'&&applicable('SIM-DV-COMBINE',f.date,profile))required.push('allocation');
 if(pending)required.unshift('fundingRelation');
 const missing=required.filter(k=>k==='fundingRelation'?pending:k==='situationRelation'?pendingSituation:f[k]===undefined);
 if(!missing.length)return undefined;
 const field=missing[0];return {field,...prompts[field],remaining:missing,collected:required.length-missing.length,total:required.length};
}
export function shortReply(text:string,field?:ClarificationField):Partial<Patch>{
 const s=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().trim().replace(/[.!?]+$/,'');
 if(field==='situationRelation'){if(/tinh huong moi|truong hop moi/.test(s))return {newSituation:true};if(/tiep tuc|tinh huong (truoc|cu)|van/.test(s))return {sameSituation:true};}
 const yes=/^(co|dung|vang|da|roi|co a|da roi)$/.test(s),no=/^(khong|chua|khong co|chua a|khong a)$/.test(s);
 if(field==='related'&&(yes||no))return {related:yes};
 if(field==='allocation'&&(yes||no))return {allocation:yes};
 if(field==='funding'&&/^(ket hop|ca hai|ket hop ca hai nguon|ca hai nguon)$/.test(s))return {funding:'combined',fundingAction:'combine'};
 if(field==='fundingRelation'&&/^(ho tro them|them|ket hop|ca hai)$/.test(s))return {funding:'combined',fundingAction:'combine'};
 if(field==='fundingRelation'&&/^(thay the|thay the hoan toan|hoan toan)$/.test(s))return {funding:'unit',fundingAction:'replace'};
 return {};
}
