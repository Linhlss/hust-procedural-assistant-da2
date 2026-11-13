import { PageReveal } from '@/components/MotionUI';
import DocumentHeader from '@/components/DocumentHeader';
import Link from 'next/link';
import { documents,documentNotice } from '@/lib/documents';
export default function Library(){return <div className="document-shell"><DocumentHeader/><PageReveal><nav><Link href="/">← Trở về hội thoại</Link></nav><div className="document-kicker">THƯ VIỆN TÀI LIỆU</div><h1>Hướng dẫn trong tầm tay.</h1><p className="document-notice">{documentNotice}</p><div className="document-grid">{documents.filter(d=>d.id!=='doi-chieu-xung-dot').map(d=><article key={d.id}><span>{d.domain} · {d.version}</span><h2><Link href={`/tai-lieu/${d.id}`}>{d.title} ↗</Link></h2><p>{d.sections.length} mục · Khoảng áp dụng: {d.from} → {d.to}</p><a href={`/tai-lieu/${d.id}.md`} download>Tải tài liệu (.md) ↓</a></article>)}</div></PageReveal></div>;}
