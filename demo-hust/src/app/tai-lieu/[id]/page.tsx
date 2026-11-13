import { PageReveal } from '@/components/MotionUI';
import DocumentHeader from '@/components/DocumentHeader';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { documentNotice, getDocument, documents } from '@/lib/documents';
export function generateStaticParams(){return documents.map(d=>({id:d.id}));}
export default async function DocumentPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const doc=getDocument(id);if(!doc)notFound();return <div className="document-shell"><DocumentHeader/><PageReveal><nav><Link href="/">← Trở về hội thoại</Link><a href={`/tai-lieu/${doc.id}.md`} download>Tải tài liệu (.md) ↓</a></nav><div className="document-kicker">THƯ VIỆN TÀI LIỆU · {doc.domain}</div><h1>{doc.title}</h1><p className="document-notice">{documentNotice}</p><dl className="document-meta"><div><dt>Phiên bản</dt><dd>{doc.version}</dd></div><div><dt>Khoảng áp dụng trong tình huống mẫu</dt><dd>{doc.from} → {doc.to}</dd></div></dl>{doc.sections.map(s=><section key={s.id} id={s.id}><span className="document-source-id">{s.sourceId}</span><h2>{s.title}</h2><p>{s.text}</p></section>)}<footer>Đây là hướng dẫn tham khảo trong bản trải nghiệm; không xác nhận hồ sơ, quyết định hoặc khoản chi.</footer></PageReveal></div>;}
