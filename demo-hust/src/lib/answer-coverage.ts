import {normalize} from './extractor';
import type {Answer} from './types';
export const asksPreparation=(message:string)=>/giay to|chung tu|ho so|bieu mau|danh muc|chuan bi/.test(normalize(message));
// This describes a gap in the selected evidence. It does not introduce a spending rule.
export function addEvidenceCoverage(answer:Answer,message:string):Answer{
 if(answer.intent!=='consult')return answer;
 const text=normalize(message),asksRate=/dinh muc|muc (chi|ho tro)|bao nhieu (tien|dong)|(?:khach san|luu tru|ve may bay).{0,55}(bao nhieu|trieu|nghin|ngan|dong)/.test(text);
 if(!asksRate)return answer;
 const quotes=normalize(answer.conclusions.flatMap(c=>c.sources.map(s=>s.quote)).join('\n'));
 if(/\d[\d.,]*\s*(dong|vnd|usd|trieu|nghin|%)/.test(quotes))return answer;
 const gap={id:'rate-evidence',group:'KL3' as const,title:'Căn cứ định mức',status:'insufficient' as const,text:'Các đoạn nguồn hiện có chưa quy định mức chi hoặc mức hỗ trợ cho khoản đang hỏi; chưa đủ căn cứ xác định khoản tiền phù hợp.',facts:[] as const,sources:[],next:'Trao đổi với đầu mối tài chính đơn vị hoặc Ban Tài chính–Kế hoạch (TCKH) để đối chiếu định mức, nguồn kinh phí và chứng từ áp dụng.',reason:'Phạm vi hỗ trợ hoạt động và danh mục giấy tờ không thay thế căn cứ về mức chi.'};
 return {...answer,text:gap.text,question:undefined,clarification:undefined,conclusions:[{...gap,facts:[]},...answer.conclusions.filter(c=>c.id!=='rate-evidence'&&(c.id!=='preparation'||asksPreparation(message)))],summary:answer.summary.split('\n').filter(line=>!line.startsWith('Cần bổ sung:')).join('\n')+'\nCăn cứ định mức: '+gap.text+'\nBước tiếp theo: '+gap.next};
}
