'use client';
import { useEffect,useState } from 'react';
import { motion,useReducedMotion } from 'motion/react';
import Icon from './Icon';
const key='hust-ui-theme';
export default function ThemeToggle(){
 const [theme,setTheme]=useState('dark'),reduce=useReducedMotion();
 useEffect(()=>{setTheme(document.documentElement.dataset.theme??'dark');const sync=(event:StorageEvent)=>{if(event.key===key){const next=event.newValue==='light'?'light':'dark';document.documentElement.dataset.theme=next;setTheme(next);}};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 function toggle(){const next=theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;setTheme(next);try{localStorage.setItem(key,next);}catch{/* Theme still works for this page. */}}
 return <button type="button" className="theme-toggle" aria-label={`Chuyển chế độ giao diện ${theme==='dark'?'sáng':'tối'}`} aria-pressed={theme==='dark'} title={`Chuyển sang giao diện ${theme==='dark'?'sáng':'tối'}`} onClick={toggle}><span className="theme-ambient theme-sun"><Icon name="sun" size={14}/></span><span className="theme-ambient theme-moon"><Icon name="moon" size={14}/></span><motion.span className="theme-thumb" initial={false} animate={{x:theme==='dark'?34:0}} transition={reduce?{duration:0}:{type:'spring',duration:.36,bounce:.24}}><Icon name={theme==='dark'?'moon':'sun'} size={14}/></motion.span></button>;
}
