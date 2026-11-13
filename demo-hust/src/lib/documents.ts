import data from '../data/documents.json';
export const documents=data;
export function getDocument(id:string){return documents.find(doc=>doc.id===id);}
export const documentNotice='Tài liệu mẫu tự tạo cho bản trải nghiệm; không phải văn bản hoặc chính sách HUST đã xác minh.';
export function documentMarkdown(id:string){const doc=getDocument(id);if(!doc)return undefined;return `# ${doc.title}\n\n> ${documentNotice}\n\nMiền nội dung: ${doc.domain}\n\nPhiên bản: ${doc.version}\n\nKhoảng áp dụng trong tình huống mẫu: ${doc.from} đến ${doc.to}\n\n${doc.sections.map(section=>`## ${section.title}\n\nMã đoạn: ${section.sourceId}\n\n${section.text}`).join('\n\n')}\n`;}
