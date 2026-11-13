import {defineConfig} from '@playwright/test';
import base from './playwright.config';
export default defineConfig({...base,testMatch:/features\.spec\.ts/,use:{...base.use,video:{mode:'on',size:{width:1440,height:1000}}}});
