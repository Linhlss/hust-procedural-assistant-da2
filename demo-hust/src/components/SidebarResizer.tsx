'use client';
import { animate,useReducedMotion,type AnimationPlaybackControls } from 'motion/react';
import { useEffect,useRef,useState,type PointerEvent,type KeyboardEvent } from 'react';
import { SIDEBAR_DEFAULT,SIDEBAR_MIN,SIDEBAR_MAX,SIDEBAR_WIDTH_KEY,preferredSidebarWidth,sidebarMaximum,sidebarWidth } from '@/lib/sidebar-width';

type Drag={id:number;x:number;width:number;preferred:number};
export default function SidebarResizer(){
 const reduced=useReducedMotion(),animation=useRef<AnimationPlaybackControls|null>(null);
 const [width,setWidth]=useState(SIDEBAR_DEFAULT),[maximum,setMaximum]=useState(SIDEBAR_MAX),[dragging,setDragging]=useState(false);
 const handle=useRef<HTMLDivElement>(null),preferred=useRef(SIDEBAR_DEFAULT),applied=useRef(SIDEBAR_DEFAULT),drag=useRef<Drag|null>(null),frame=useRef<number|null>(null),pending=useRef<number|null>(null);
 function apply(value:number){const next=sidebarWidth(value,window.innerWidth);applied.current=next;document.documentElement.style.setProperty('--sidebar-width',`${next}px`);setWidth(next);setMaximum(sidebarMaximum(window.innerWidth));return next;}
 function save(){try{localStorage.setItem(SIDEBAR_WIDTH_KEY,String(preferred.current));}catch{/* Resizing remains available without storage. */}}
 function smooth(value:number){animation.current?.stop();preferred.current=sidebarWidth(value,window.innerWidth);save();if(reduced){apply(preferred.current);return;}animation.current=animate(applied.current,preferred.current,{duration:.2,ease:[.22,1,.36,1],onUpdate:apply});}
 function flush(){if(frame.current!==null)cancelAnimationFrame(frame.current);frame.current=null;if(pending.current!==null){apply(pending.current);pending.current=null;}}
 function finish(commit:boolean){const start=drag.current;if(!start)return;flush();drag.current=null;preferred.current=commit?applied.current:start.preferred;if(!commit)apply(preferred.current);else save();setDragging(false);delete document.documentElement.dataset.sidebarResizing;if(handle.current?.hasPointerCapture(start.id))handle.current.releasePointerCapture(start.id);}
 useEffect(()=>{
  try{preferred.current=preferredSidebarWidth(localStorage.getItem(SIDEBAR_WIDTH_KEY));}catch{/* Use the default width. */}apply(preferred.current);
  const resize=()=>{animation.current?.stop();apply(drag.current?applied.current:preferred.current);},blur=()=>finish(false);
  window.addEventListener('resize',resize);window.addEventListener('blur',blur);
  return()=>{animation.current?.stop();window.removeEventListener('resize',resize);window.removeEventListener('blur',blur);if(frame.current!==null)cancelAnimationFrame(frame.current);delete document.documentElement.dataset.sidebarResizing;};
 },[]);
 useEffect(()=>{if(!dragging)return;const escape=(event:globalThis.KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();finish(false);}};window.addEventListener('keydown',escape,true);return()=>window.removeEventListener('keydown',escape,true);},[dragging]);
 function start(event:PointerEvent<HTMLDivElement>){if(event.button!==0||drag.current)return;event.preventDefault();animation.current?.stop();handle.current?.focus({preventScroll:true});drag.current={id:event.pointerId,x:event.clientX,width:applied.current,preferred:preferred.current};event.currentTarget.setPointerCapture(event.pointerId);document.documentElement.dataset.sidebarResizing='true';setDragging(true);}
 function move(event:PointerEvent<HTMLDivElement>){const start=drag.current;if(!start||start.id!==event.pointerId)return;pending.current=start.width+event.clientX-start.x;if(frame.current===null)frame.current=requestAnimationFrame(()=>{frame.current=null;if(pending.current!==null){apply(pending.current);pending.current=null;}});}
 function reset(){finish(false);smooth(SIDEBAR_DEFAULT);}
 function keyboard(event:KeyboardEvent<HTMLDivElement>){if(drag.current)return;let next:number;if(event.key==='ArrowLeft')next=sidebarWidth(preferred.current,window.innerWidth)-10;else if(event.key==='ArrowRight')next=sidebarWidth(preferred.current,window.innerWidth)+10;else if(event.key==='Home')next=SIDEBAR_MIN;else if(event.key==='End')next=sidebarMaximum(window.innerWidth);else return;event.preventDefault();smooth(next);}
 return <div ref={handle} className="sidebar-resizer" role="separator" tabIndex={0} aria-label="Điều chỉnh độ rộng thanh bên" aria-orientation="vertical" aria-valuemin={SIDEBAR_MIN} aria-valuemax={maximum} aria-valuenow={width} aria-valuetext={`${width} pixel`} title="Kéo để đổi độ rộng · Nhấp đúp để đặt lại" onPointerDown={start} onPointerMove={move} onPointerUp={event=>{if(drag.current?.id===event.pointerId)finish(true);}} onPointerCancel={()=>finish(false)} onLostPointerCapture={()=>finish(false)} onDoubleClick={reset} onKeyDown={keyboard}/>;
}
