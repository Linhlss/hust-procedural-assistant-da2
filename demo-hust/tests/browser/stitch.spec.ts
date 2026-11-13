import { test,expect,type Page } from '@playwright/test';
import { openContext,settleVisuals } from './helpers';
test.beforeEach(async({page},info)=>{if(!info.title.startsWith('dark is default'))await page.addInitScript(()=>{if(localStorage.getItem('hust-ui-theme')===null)localStorage.setItem('hust-ui-theme','light');});});
const dir=process.env.HUST_TEST_ARTIFACT_DIR??'artifacts/demo-runs/stitch-2026-11-08';
const full='Hội thảo tại Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
async function send(page:Page,text:string){const count=Number(await page.locator('.conversation').getAttribute('data-message-count'));await page.getByLabel('Nhập tình huống hoặc sửa dữ kiện').fill(text);await page.getByRole('button',{name:'Gửi câu hỏi'}).click();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count',String(count+1));}

test('dark is default; theme survives reload and document navigation without changing the conversation',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.getByRole('button',{name:'Chuyển chế độ giao diện sáng'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await send(page,full);const history=await page.evaluate(()=>localStorage.getItem('hust-conversations-v2'));
 await page.getByRole('button',{name:'Chuyển chế độ giao diện tối'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','1');
 expect(await page.evaluate(()=>localStorage.getItem('hust-conversations-v2'))).toBe(history);
 await page.goto('/tai-lieu');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await expect(page.locator('.document-grid article')).toHaveCount(5);
 const links=await page.locator('.document-grid h2 a').evaluateAll(els=>els.map(e=>e.getAttribute('href')!));
 for(const link of links){await page.goto(link);await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await expect(page.getByRole('heading',{level:1})).toBeVisible();const r=await page.request.get(link+'.md');expect(r.ok()).toBe(true);expect(await r.text()).toContain('Tài liệu mẫu tự tạo');}
 await page.getByRole('button',{name:'Chuyển chế độ giao diện sáng'}).click();await page.goto('/');await expect(page.locator('html')).toHaveAttribute('data-theme','light');await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','1');expect(errors).toEqual([]);
});

test('history search and per-field supplement controls are available',async({page})=>{
 await page.goto('/');await expect(page.getByRole('searchbox',{name:'Tìm kiếm lịch sử hội thoại'})).toBeEnabled();await openContext(page);
 const field=page.locator('.current-fact[data-field="location"]');await field.getByRole('button',{name:'Bổ sung địa điểm',exact:true}).click();await expect(field.getByRole('button',{name:'Trong nước',exact:true})).toBeEnabled();await field.getByRole('button',{name:'Hủy nhập',exact:true}).click();await expect(field.getByRole('button',{name:'Bổ sung địa điểm',exact:true})).toBeFocused();
});

for(const theme of ['light','dark'])for(const panel of [false,true])test(`reference layout and source navigation (${theme}, ${panel?'panel open':'panel closed'})`,async({page})=>{
 await page.setViewportSize({width:1280,height:1024});await page.goto('/');await send(page,'tôi chuẩn bị đi công tác, cần chuẩn bị gì?');await page.locator('.question').getByRole('button',{name:'Chưa thể cung cấp',exact:true}).click();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','2');
 await expect(page.locator('.missing-information')).toContainText('nguồn kinh phí, ngày hoạt động');
 await expect(page.locator('.missing-information')).not.toContainText('địa điểm');
 if(theme==='dark')await page.getByRole('button',{name:'Chuyển chế độ giao diện tối'}).click();
 if(panel)await openContext(page);
 await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>window.scrollTo(0,0));
 expect((await page.locator('.sidebar').boundingBox())!.width).toBe(232);expect((await page.locator('.topbar').boundingBox())!.height).toBe(56);
 expect((await page.locator('.composer-zone').boundingBox())!.width).toBeLessThanOrEqual(780);
 if(panel){expect((await page.locator('.context-panel').boundingBox())!.width).toBe(320);const header=await page.locator('.topbar').boundingBox();const actions=await page.locator('.topbar-actions').boundingBox();expect(actions!.x+actions!.width).toBeLessThanOrEqual(header!.x+header!.width);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await settleVisuals(page);await page.screenshot({path:`${dir}/reference-${theme}-${panel?'open':'closed'}.png`});
 if(panel)await page.locator('.panel-close').click();await expect(page.locator('.context-panel')).toHaveCount(0);await page.locator('.citation-ref').first().click();await expect(page.locator('.source:focus')).toBeVisible();
});

for(const width of [390,768])test(`responsive light and dark at ${width}px, with documents and drawers`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/');await send(page,full);
 for(const theme of ['light','dark']){
  if(theme==='dark')await page.getByRole('button',{name:'Chuyển chế độ giao diện tối'}).click();await settleVisuals(page);await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const dock=(await page.locator('.composer-dock').boundingBox())!,foot=(await page.locator('.answer-footnote').last().boundingBox())!;expect(foot.y+foot.height).toBeLessThan(dock.y);
  await settleVisuals(page);await page.screenshot({path:`${dir}/responsive-${width}-${theme}.png`});await openContext(page);await expect(page.locator('.panel-close')).toBeFocused();await page.keyboard.press('Escape');await expect(page.locator('.context-panel')).toHaveCount(0);
 }
 await page.goto('/tai-lieu');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await settleVisuals(page);await page.screenshot({path:`${dir}/library-${width}-dark.png`,fullPage:true});
 await page.locator('.document-grid h2 a').first().click();await expect(page.getByRole('heading',{level:1})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});


test('a source-only question does not request unrelated personal facts after a declined clarification',async({page})=>{
 await page.goto('/');await send(page,'tôi chuẩn bị đi công tác, cần chuẩn bị gì?');await page.locator('.question').getByRole('button',{name:'Chưa thể cung cấp',exact:true}).click();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','2');
 await expect(page.locator('.missing-information')).toContainText('nguồn kinh phí, ngày hoạt động');
 await send(page,'Cho tôi xem các tài liệu hội thảo công tác.');
 await expect(page.locator('.is-current-response .question')).toHaveCount(0);await expect(page.locator('.is-current-response .missing-information')).toHaveCount(0);
 await expect(page.locator('.is-current-response .citation-ref').first()).toBeVisible();
});
