import type { ReactNode } from 'react';
import Icon from './Icon';
import SidebarResizer from './SidebarResizer';

export function Brand(){return <a className="brand" href="/" aria-label="Trang đầu trợ lý thủ tục"><span className="brand-symbol">H</span><span>HUST<span className="brand-sub">TRỢ LÝ THỦ TỤC</span></span></a>;}
export function NewChatButton({ready,onNew}:{ready:boolean;onNew:()=>void}){return <button className="new-chat" onClick={onNew} disabled={!ready}><span><Icon name="plus"/>Hội thoại mới</span><Icon name="arrow"/></button>;}
export default function ChatSidebar({ready,onNew,children,search}:{ready:boolean;onNew:()=>void;children:ReactNode;search:ReactNode}){return <aside className="sidebar"><div className="sidebar-top"><Brand/><div className="project-tag"><span className="dot"/>KHCN · TCKH · TCNS</div><NewChatButton ready={ready} onNew={onNew}/>{search}</div><div className="sidebar-content">{children}</div><div className="sidebar-bottom"><a className="library-link" href="/tai-lieu" target="_blank" rel="noreferrer"><span className="mini-mark"><Icon name="book"/></span><span>Thư viện tài liệu<small>Hướng dẫn & căn cứ</small></span><Icon name="arrow"/></a></div><SidebarResizer/></aside>;}
