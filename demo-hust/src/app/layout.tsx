import type { Metadata } from 'next';
import './globals.css';
import { MotionProvider } from '@/components/MotionUI';
import { sidebarWidthBootstrap } from '@/lib/sidebar-width';
export const metadata:Metadata={title:'HUST · Trợ lý thủ tục | Demo T6',description:'Demo mô phỏng tư vấn theo tình huống, có căn cứ và kiểm tra lại khi dữ kiện thay đổi. Không phải dịch vụ chính thức của HUST.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="vi" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.theme=localStorage.getItem('hust-ui-theme')==='light'?'light':'dark'}catch(e){}"+sidebarWidthBootstrap}}/></head><body><MotionProvider>{children}</MotionProvider></body></html>;}
