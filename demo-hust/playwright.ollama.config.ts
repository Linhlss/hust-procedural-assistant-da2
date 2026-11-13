import {defineConfig} from '@playwright/test';
import base from './playwright.config';
export default defineConfig({...base,testDir:'./tests/ollama-browser',timeout:360000,projects:[{name:'chromium',use:{browserName:'chromium',channel:'chrome',viewport:{width:1280,height:1024}}}],use:{...base.use,actionTimeout:10000,baseURL:process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:3020',viewport:{width:1280,height:1024},video:{mode:'on',size:{width:1280,height:1024}}}});
