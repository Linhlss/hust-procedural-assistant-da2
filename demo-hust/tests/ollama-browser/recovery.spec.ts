import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {openContext,settleVisuals} from '../browser/helpers';
const dir=process.env.HUST_TEST_ARTIFACT_DIR!;
test('real chat and direct edits preserve facts; an explicit selection recovers or corrects a natural-language change',async({page})=>{
 await mkdir(dir,{recursive:true});await page.goto('/');const exchanges:unknown[]=[];
 async function send(text:string){const response=page.waitForResponse(r=>r.url().endsWith('/api/chat')&&r.request().method()==='POST',{timeout:130000});await page.locator('#message').fill(text);await page.getByRole('button',{name:'Gửi câu hỏi',exact:true}).click();const r=await response,data=await r.json();exchanges.push({text,status:r.status(),code:data.code,facts:data.answer?.facts});await writeFile(`${dir}/real-attempts.json`,JSON.stringify(exchanges,null,2));return {status:r.status(),data};}
 const first=await send('Tôi dự hội thảo tại Hà Nội, dùng kinh phí nhiệm vụ, có phục vụ nhiệm vụ.');expect(first.status).toBe(200);await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','1');
 await openContext(page);const date=page.locator('.current-fact[data-field="date"]');await date.locator('.fact-edit-toggle').click();await date.getByLabel('Ngày/tháng/năm').fill('2026-11-15');await date.getByRole('button',{name:'Cập nhật',exact:true}).click();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','2');await page.locator('.panel-close').click();
 const natural=await send('Chuyển hoàn toàn sang kinh phí đơn vị.');let count=natural.status===200?3:2;
 if(natural.status!==200){expect(natural.status).toBe(503);await expect(page.locator('.error[role=alert]')).toContainText('giữ nguyên');await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','2');await expect(page.locator('#message')).toHaveValue('Chuyển hoàn toàn sang kinh phí đơn vị.');}
 else await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','3');
 await openContext(page);const row=page.locator('.current-fact[data-field="funding"]');
 if(natural.data.answer?.facts.funding!=='unit'){
  await row.locator('.fact-edit-toggle').click();await row.getByRole('button',{name:'Chỉ kinh phí đơn vị',exact:true}).click();count++;await expect(page.locator('.conversation')).toHaveAttribute('data-message-count',String(count));
 }
 await expect(row).toContainText('Kinh phí đơn vị');await expect(date).toContainText('2026-11-15');await page.locator('.panel-close').click();const view=page.getByRole('button',{name:'Xem phản hồi mới',exact:false});if(await view.count())await view.click();await settleVisuals(page);await page.screenshot({path:`${dir}/explicit-recovery.png`});
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hust-conversations-v2')??'[]'));const last=saved[0].turns.at(-1);expect(last.answer.facts.funding).toBe('unit');expect(last.answer.facts.date).toBe('2026-11-15');expect(last.answer.conclusions.some((c:{id:string})=>c.id==='task')).toBe(false);expect(saved[0].turns[1].input.kind).toBe('fact-edit');
 await writeFile(`${dir}/recovery-summary.json`,JSON.stringify({naturalSourceChange:{status:natural.status,code:natural.data.code,correct:natural.data.answer?.facts.funding==='unit'},explicitSelection:natural.data.answer?.facts.funding!=='unit',finalFacts:last.answer.facts,turnCount:count,policyValidation:false},null,2));
 await page.reload();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count',String(count));
});
