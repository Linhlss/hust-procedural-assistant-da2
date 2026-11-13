'use client';
import {useEffect,useRef,useState} from 'react';
import type {Facts} from '@/lib/types';
import {isValidDate,type FactEdit} from '@/lib/input-schema';
import {labels} from '@/lib/presentation';
const choices={activity:[['conference','Hội thảo'],['work','Công tác']],location:[['domestic','Trong nước'],['foreign','Nước ngoài']],funding:[['task','Chỉ kinh phí nhiệm vụ'],['unit','Chỉ kinh phí đơn vị'],['combined','Kết hợp hai nguồn']],related:[[true,'Có phục vụ'],[false,'Không phục vụ'],[null,'Chưa xác định']],allocation:[[true,'Đã phân định'],[false,'Chưa phân định'],[null,'Chưa xác định']]} as const;
export default function FactEditor({field,value,busy,onApply,onClose,onCancel}:{field:keyof Facts;value:Facts[keyof Facts];busy:boolean;onApply:(edit:FactEdit)=>Promise<boolean>;onClose:()=>void;onCancel:()=>void}){
 const [date,setDate]=useState(typeof value==='string'?value:''),[selected,setSelected]=useState<FactEdit>(),[failed,setFailed]=useState(false);const first=useRef<HTMLInputElement|null>(null),root=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{(first.current??root.current?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus({preventScroll:true});},[]);
 async function apply(edit:FactEdit){if(busy)return;setSelected(edit);setFailed(false);if(await onApply(edit))onClose();else setFailed(true);}
 return <div className="fact-editor" ref={root} role="group" aria-label={`Nhập ${labels[field].toLowerCase()}`} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(busy)onCancel();else onClose();}}}>
 {field==='date'?<form onSubmit={e=>{e.preventDefault();if(isValidDate(date))void apply({field:'date',value:date});}}><label>Ngày/tháng/năm<input ref={first} type="date" value={date} onChange={e=>{setDate(e.target.value);setFailed(false);}} disabled={busy}/></label><div className="fact-editor-actions"><button disabled={busy||!isValidDate(date)||date===value} type="submit">Cập nhật</button>{value!==undefined&&<button type="button" disabled={busy} onClick={()=>void apply({field:'date',value:null})}>Gỡ ngày</button>}</div></form>:<div className="fact-editor-choices">{choices[field].map(([v,label])=><button key={String(v)} type="button" disabled={busy||v===(value??null)} aria-pressed={v===(selected?selected.value:value??null)} onClick={()=>void apply({field,value:v} as FactEdit)}>{label}</button>)}</div>}
 {failed&&<p className="fact-editor-error" role="status">Chưa cập nhật. Lựa chọn được giữ lại.{selected&&<button disabled={busy} type="button" onClick={()=>void apply(selected)}>Thử lại lựa chọn</button>}</p>}
 <button type="button" className="fact-editor-cancel" onClick={busy?onCancel:onClose}>{busy?'Hủy cập nhật':'Hủy nhập'}</button>
 </div>;
}
