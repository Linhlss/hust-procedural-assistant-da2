'use client';
import {Fragment,useId,type RefObject} from 'react';
import Icon from './Icon';
import {highlightParts} from '@/lib/history-search';
export function SearchHighlight({text,query}:{text:string;query:string}){return <>{highlightParts(text,query).map((p,i)=>p.match?<mark key={i}>{p.text}</mark>:<Fragment key={i}>{p.text}</Fragment>)}</>;}
export default function HistorySearch({value,onChange,inputRef}:{value:string;onChange:(value:string)=>void;inputRef?:RefObject<HTMLInputElement|null>}){const id=useId();return <div className="history-search enabled-search"><Icon name="search"/><label className="sr-only" htmlFor={id}>Tìm kiếm lịch sử hội thoại</label><input id={id} ref={inputRef} type="search" value={value} onChange={e=>onChange(e.target.value)} placeholder="Tìm trong hội thoại…" autoComplete="off" onKeyDown={e=>{if(e.key==='Escape'&&value){e.preventDefault();e.stopPropagation();onChange('');}}}/>{value&&<button type="button" aria-label="Xóa từ khóa tìm kiếm" onClick={()=>{onChange('');document.getElementById(id)?.focus({preventScroll:true});}}>×</button>}</div>;}
