import {test as base,expect} from '@playwright/test';
export type {Page,Locator} from '@playwright/test';
export {expect};
export const test=base.extend<{_projectSession:void}>({_projectSession:[async({context,baseURL},use)=>{
 const cookie=process.env.HUST_TEST_COOKIE;
 if(cookie){if(!baseURL?.startsWith('https://hust-t6-demo-'))throw new Error('Invalid test session target');
 await context.addCookies(cookie.split('; ').map(pair=>{const i=pair.indexOf('=');return {name:pair.slice(0,i),value:pair.slice(i+1),url:baseURL,httpOnly:true,secure:true,sameSite:'Lax' as const};}));}
 await use();
},{auto:true}]});
