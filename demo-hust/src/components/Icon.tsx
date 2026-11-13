import type { CSSProperties,ReactNode } from 'react';
const paths:Record<string,ReactNode>={
 plus:<path d="M12 5v14M5 12h14"/>,send:<path d="m6 10 6-6 6 6M12 4v16"/>,arrow:<path d="M6 18 18 6M6 6h12v12"/>,
 book:<><path d="M12 5v15M3 4c4-1 6 0 9 1 3-1 5-2 9-1v15c-4-1-6 0-9 1-3-1-5-2-9-1Z"/></>,
 panel:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16M8 7v10M11 7v10"/></>,
 search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
 moon:<path d="M20.8 14A9 9 0 0 1 10 3.2 9 9 0 1 0 20.8 14Z"/>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
 close:<path d="m6 6 12 12M18 6 6 18"/>,chevron:<path d="m6 9 6 6 6-6"/>,
 copy:<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></>,
 alert:<><path d="m12 3 10 18H2Z"/><path d="M12 9v5M12 17v1"/></>,check:<path d="m5 12 4 4L19 6"/>,info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/></>};
export default function Icon({name,size=16,style}:{readonly name:string;readonly size?:number;readonly style?:CSSProperties}){return <svg className={`icon icon-${name}`} aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>{paths[name]??paths.info}</svg>;}
