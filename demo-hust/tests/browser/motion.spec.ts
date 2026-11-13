import { test,expect,type Page } from '@playwright/test';
import { openContext,openHistory,settleVisuals } from './helpers';
const dir=process.env.HUST_TEST_ARTIFACT_DIR??'artifacts/demo-runs/motion-2026-11-08';
const full='Hội thảo tại Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
async function send(page:Page,text:string){const n=Number(await page.locator('.conversation').getAttribute('data-message-count'));await page.locator('#message').fill(text);await page.getByRole('button',{name:'Gửi câu hỏi',exact:true}).click();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count',String(n+1));}

test('charcoal defaults, compact composer and persisted light preference are correct without hydration errors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');expect(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(11, 11, 13)');
 expect((await page.locator('.theme-toggle').boundingBox())!.width).toBe(68);const textarea=(await page.locator('#message').boundingBox())!,button=(await page.locator('.send').boundingBox())!;expect(button.x).toBeGreaterThan(textarea.x+textarea.width);expect(button.y+button.height).toBeCloseTo(textarea.y+textarea.height,0);
 await page.getByRole('button',{name:'Chuyển chế độ giao diện sáng'}).click();await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.goto('/tai-lieu');await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.locator('.document-grid h2 a').first().click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');expect(errors).toEqual([]);
});

for(const phone of [false,true])test(`interrupted drawer animation cannot leave invisible controls or lose input (${phone?'phone':'desktop'})`,async({page})=>{
 if(phone)await page.setViewportSize({width:390,height:844});await page.goto('/');await page.locator('#message').fill('Bản nháp giữ lại khi đóng mở');const trigger=page.getByRole('button',{name:'Không gian tình huống',exact:true});await trigger.click();await trigger.press('Enter');await trigger.press('Enter');await expect(page.locator('.context-panel')).toHaveAttribute('data-motion-state','idle');await expect(page.locator('.context-panel')).not.toHaveAttribute('inert','');
 await page.keyboard.press('Escape');await expect(page.locator('.context-panel')).toHaveCount(0);await expect(page.locator('.context-backdrop')).toHaveCount(0);await expect(trigger).toBeFocused();await expect(page.locator('#message')).toHaveValue('Bản nháp giữ lại khi đóng mở');
 if(phone){await page.getByRole('button',{name:'Lịch sử',exact:true}).click();await expect(page.locator('.mobile-history')).toHaveAttribute('data-motion-state','idle');await page.keyboard.press('Escape');await expect(page.locator('.mobile-history')).toHaveCount(0);await expect(page.locator('.history-backdrop')).toHaveCount(0);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await settleVisuals(page);await page.screenshot({path:`${dir}/motion-drawers-${phone?'phone':'desktop'}.png`});
});

test('source navigation waits for expansion, remains exact across interruptions and preserves keyboard access',async({page})=>{
 await page.goto('/');await send(page,full);const first=page.locator('.conclusion').filter({hasText:'Điều kiện địa điểm chung'}).getByRole('button',{name:'Xem căn cứ',exact:false});await first.click();await expect(page.locator('[data-source-id=SIM-CT-2026]')).toBeFocused();
 await page.locator('.citation-panel>summary').click();await page.locator('.citation-panel>summary').press('Enter');await page.locator('.conclusion').filter({hasText:'Điều kiện liên hệ nhiệm vụ'}).getByRole('button',{name:'Xem căn cứ',exact:false}).click();await expect(page.locator('[data-source-id=SIM-NV-1]')).toBeFocused();await expect(page.locator('[data-source-id=SIM-NV-1]')).toBeInViewport();
 await page.locator('.citation-panel>summary').click();await expect(page.locator('.citation-panel')).not.toHaveAttribute('open','');await expect(page.locator('.citation-panel .animated-collapse').first()).toHaveAttribute('inert','');await page.locator('#message').fill('Vẫn nhập được sau khi đóng căn cứ');await expect(page.locator('#message')).toHaveValue('Vẫn nhập được sau khi đóng căn cứ');
});

test('history undo during exit and rapid theme changes settle to the last requested state',async({page})=>{
 await page.goto('/');await send(page,full);await page.getByRole('button',{name:'Hội thoại mới',exact:true}).click();await send(page,'Tôi đi công tác bằng kinh phí đơn vị.');await openHistory(page);await page.locator('.history-delete').first().click();await page.getByRole('button',{name:'Khôi phục',exact:true}).click();await expect(page.locator('.history-open')).toHaveCount(2);await expect(page.locator('.history-row[inert]')).toHaveCount(0);
 const toggle=page.locator('.theme-toggle');await toggle.click();await toggle.press('Enter');await toggle.press('Enter');await expect(page.locator('html')).toHaveAttribute('data-theme','light');expect(await page.evaluate(()=>localStorage.getItem('hust-ui-theme'))).toBe('light');await page.reload();await expect(page.locator('.history-open')).toHaveCount(2);await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('reduced motion disables movement while all drawers, citations and theme controls remain functional',async({browser})=>{
 const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();await page.goto('/');await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');await send(page,full);await openContext(page);expect(await page.locator('.context-panel').evaluate(e=>getComputedStyle(e).transform)).toBe('none');await page.keyboard.press('Escape');await expect(page.locator('.context-panel')).toHaveCount(0);
 await page.locator('.citation-ref').first().click();await expect(page.locator('.source:focus')).toBeVisible();await page.getByRole('button',{name:'Chuyển chế độ giao diện sáng'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');await settleVisuals(page);await page.screenshot({path:`${dir}/reduced-motion.png`});await context.close();
});
