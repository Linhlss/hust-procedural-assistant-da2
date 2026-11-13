import Link from 'next/link';
import { Brand } from './ChatSidebar';
import ThemeToggle from './ThemeToggle';
export default function DocumentHeader(){return <header className="document-header"><Brand/><div className="document-header-actions"><Link href="/">← Trở về hội thoại</Link><ThemeToggle/></div></header>;}
