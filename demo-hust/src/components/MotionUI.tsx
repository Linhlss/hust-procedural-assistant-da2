'use client';
import { AnimatePresence,MotionConfig,motion,useIsPresent,useReducedMotion,type HTMLMotionProps } from 'motion/react';
import { forwardRef,useEffect,useId,useLayoutEffect,useRef,useState,type ReactNode } from 'react';
import Icon from './Icon';
export { AnimatePresence,motion,useReducedMotion };
const spring={type:'spring' as const,duration:.34,bounce:.2};
let readingFrame:number|null=null,lastScroll=0,scrollGeneration=0;
export function stopReadingScroll(){scrollGeneration++;if(readingFrame!==null)cancelAnimationFrame(readingFrame);readingFrame=null;}
export function scrollToReadingTarget(target:HTMLElement,block:'start'|'center'='start',reduced=false){
 stopReadingScroll();const bounds=target.getBoundingClientRect(),padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0,margin=parseFloat(getComputedStyle(target).scrollMarginTop)||0;
 const desired=window.scrollY+bounds.top-(block==='center'?(innerHeight-bounds.height)/2:padding+margin),end=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,desired));
 if(reduced){window.scrollTo({top:end,behavior:'instant'});return;}
 const from=window.scrollY,started=performance.now(),generation=scrollGeneration;lastScroll=from;
 const step=(now:number)=>{if(generation!==scrollGeneration)return;const progress=Math.min(1,(now-started)/240),eased=1-Math.pow(1-progress,3);window.scrollTo({top:from+(end-from)*eased,behavior:'instant'});lastScroll=window.scrollY;readingFrame=progress<1?requestAnimationFrame(step):null;};
 readingFrame=requestAnimationFrame(step);
}
function Preferences(){const reduced=useReducedMotion();useEffect(()=>{document.documentElement.dataset.motion=reduced?'reduced':'full';},[reduced]);useEffect(()=>{
 const interrupt=()=>stopReadingScroll(),scroll=()=>{if(readingFrame!==null&&Math.abs(window.scrollY-lastScroll)>1)stopReadingScroll();};
 window.addEventListener('pointerdown',interrupt,{passive:true});window.addEventListener('wheel',interrupt,{passive:true});window.addEventListener('touchstart',interrupt,{passive:true});window.addEventListener('keydown',interrupt);window.addEventListener('scroll',scroll,{passive:true});
 return()=>{stopReadingScroll();window.removeEventListener('pointerdown',interrupt);window.removeEventListener('wheel',interrupt);window.removeEventListener('touchstart',interrupt);window.removeEventListener('keydown',interrupt);window.removeEventListener('scroll',scroll);};
 },[]);return null;}
export function MotionProvider({children}:{children:ReactNode}){return <MotionConfig reducedMotion="user" transition={spring}><Preferences/>{children}</MotionConfig>;}

export function AnimatedCollapse({open,children,id,className,onRest}:{open:boolean;children:ReactNode;id?:string;className?:string;onRest?:()=>void}){
 const reduce=useReducedMotion(),[moving,setMoving]=useState(false),[shown,setShown]=useState(open),latest=useRef(open),previous=useRef(open);latest.current=open;
 useLayoutEffect(()=>{if(open)setShown(true);if(previous.current!==open){previous.current=open;setMoving(!reduce);}},[open,reduce]);
 useEffect(()=>{if(!moving){const tick=requestAnimationFrame(()=>onRest?.());return()=>cancelAnimationFrame(tick);}},[moving,open,onRest]);
 return <motion.div id={id} className="animated-collapse" data-motion-state={moving?'moving':'idle'} data-fold-open={open} aria-hidden={!open} inert={!open} initial={false} animate={{height:open?'auto':0,opacity:open?1:0}} transition={{height:{duration:reduce?0:.26,ease:[.22,1,.36,1]},opacity:{duration:reduce?0:.16}}} onAnimationStart={()=>setMoving(true)} onAnimationComplete={()=>{setMoving(false);if(!latest.current)setShown(false);}}><div className={className} hidden={!open&&!shown}>{children}</div></motion.div>;
}
export function AnimatedDetails({children,summary,className='',bodyClassName,open:controlled,defaultOpen=false,onOpenChange,onRest,label,mode='collapse'}:{children:ReactNode;summary:ReactNode;className?:string;bodyClassName?:string;open?:boolean;defaultOpen?:boolean;onOpenChange?:(open:boolean)=>void;onRest?:()=>void;label?:string;mode?:'collapse'|'popover'}){
 const reduce=useReducedMotion(),[internal,setInternal]=useState(defaultOpen),expanded=controlled??internal,[rendered,setRendered]=useState(expanded);
 const root=useRef<HTMLDetailsElement>(null),trigger=useRef<HTMLElement>(null),latest=useRef(expanded),id=useId();latest.current=expanded;
 function change(value:boolean){if(controlled===undefined)setInternal(value);onOpenChange?.(value);}
 useLayoutEffect(()=>{if(expanded)setRendered(true);},[expanded]);
 useEffect(()=>{if(!expanded||mode!=='popover')return;const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!root.current?.contains(event.target))change(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[expanded,mode]);
 function rest(){if(!latest.current)setRendered(false);onRest?.();}
 return <details ref={root} className={className} open={expanded||rendered} data-expanded={expanded} onKeyDown={event=>{if(event.key==='Escape'&&expanded){event.preventDefault();event.stopPropagation();change(false);trigger.current?.focus({preventScroll:true});}}}><summary ref={trigger} aria-label={label} title={label} aria-expanded={expanded} aria-controls={id} onClick={event=>{event.preventDefault();change(!expanded);}}>{summary}{mode==='collapse'&&<span className="fold-arrow" aria-hidden="true"><Icon name="chevron" size={13}/></span>}</summary>{mode==='collapse'?<AnimatedCollapse id={id} open={expanded} className={bodyClassName} onRest={rest}>{children}</AnimatedCollapse>:<motion.div id={id} className={bodyClassName} aria-hidden={!expanded} inert={!expanded} initial={false} animate={{opacity:expanded?1:0,y:expanded?0:-8,scale:expanded?1:.98}} transition={reduce?{duration:0}:spring} onAnimationComplete={rest}>{children}</motion.div>}</details>;
}
export function AnimatedPanel({children,side='right',className,id,label}:{children:ReactNode;side?:'left'|'right';className:string;id?:string;label:string}){
 const reduce=useReducedMotion(),present=useIsPresent(),[state,setState]=useState('moving');
 return <motion.aside id={id} className={className} aria-label={label} aria-hidden={!present} inert={!present} data-motion-state={state} initial={{x:reduce?0:side==='left'?-40:40,opacity:0}} animate={{x:0,opacity:1}} exit={{x:reduce?0:side==='left'?-32:32,opacity:0}} transition={reduce?{duration:0}:spring} onAnimationStart={()=>setState('moving')} onAnimationComplete={()=>setState('idle')}>{children}</motion.aside>;
}
export function AnimatedBackdrop({className,onClose,label}:{className:string;onClose:()=>void;label:string}){const present=useIsPresent(),reduce=useReducedMotion();return <motion.button className={className} tabIndex={-1} aria-label={label} aria-hidden={!present} inert={!present} style={{pointerEvents:present?'auto':'none'}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?0:.18}} onClick={onClose}/>;}
export const HistoryItem=forwardRef<HTMLDivElement,HTMLMotionProps<'div'>>(function HistoryItem(props,ref){const present=useIsPresent(),reduce=useReducedMotion();return <motion.div {...props} ref={ref} layout="position" aria-hidden={!present} inert={!present} initial={{opacity:0,x:reduce?0:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:reduce?0:-10}} transition={reduce?{duration:0}:spring}/>;});
export function ResponseReveal({children}:{children:ReactNode}){const reduce=useReducedMotion();return <motion.div className="response-reveal" initial={{opacity:0,y:reduce?0:10}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.22,ease:'easeOut'}}>{children}</motion.div>;}
export function PageReveal({children}:{children:ReactNode}){const reduce=useReducedMotion();return <motion.main className="document-page" initial={{opacity:0,y:reduce?0:8}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.22}}>{children}</motion.main>;}
export function Notice({children,className,role}:{children:ReactNode;className:string;role?:'alert'|'status'}){const present=useIsPresent(),reduce=useReducedMotion();return <motion.div className={className} role={role} aria-hidden={!present} inert={!present} initial={{opacity:0,y:reduce?0:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduce?0:4}} transition={{duration:reduce?0:.18}}>{children}</motion.div>;}
