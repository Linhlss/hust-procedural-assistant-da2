import { test,expect,type Page } from '@playwright/test';
import { openContext,openHistory,settleVisuals } from './helpers';
test.beforeEach(async({page})=>{await page.addInitScript(()=>{if(localStorage.getItem('hust-ui-theme')===null)localStorage.setItem('hust-ui-theme','light');});});
const dir=process.env.HUST_TEST_ARTIFACT_DIR??'artifacts/demo-runs/sidebar-2026-11-08';
const full='Tôi chuẩn bị tham dự hội thảo khoa học trong nước tại Hà Nội ngày 15/11/2026, dùng kinh phí nhiệm vụ và có phục vụ nhiệm vụ.';
const rail=(p:Page)=>p.getByRole('separator',{name:'Điều chỉnh độ rộng thanh bên'});
async function send(p:Page,text:string){const n=Number(await p.locator('.conversation').getAttribute('data-message-count'));await p.locator('#message').fill(text);await p.getByRole('button',{name:'Gửi câu hỏi'}).click();await expect(p.locator('.conversation')).toHaveAttribute('data-message-count',String(n+1));}
async function drag(p:Page,width:number,release=true){const h=await rail(p).boundingBox();const initial=Number(await rail(p).getAttribute('aria-valuenow'));await p.mouse.move(h!.x+h!.width/2,h!.y+300);await p.mouse.down();await p.mouse.move(h!.x+h!.width/2+width-initial,h!.y+370,{steps:6});if(release)await p.mouse.up();}
async function width(p:Page,value:number){await expect(rail(p)).toHaveAttribute('aria-valuenow',String(value));expect((await p.locator('.sidebar').boundingBox())!.width).toBe(value);}

test('pointer resizing clamps, saves only on release, cancels and resets without changing the draft or history',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await send(page,full);await page.locator('#message').fill('Bản nháp đang viết');const history=await page.evaluate(()=>localStorage.getItem('hust-conversations-v2'));
 await width(page,232);await drag(page,600,false);await width(page,360);expect(await page.evaluate(()=>localStorage.getItem('hust-sidebar-width'))).toBeNull();await page.mouse.up();expect(await page.evaluate(()=>localStorage.getItem('hust-sidebar-width'))).toBe('360');
 await drag(page,100);await width(page,200);await drag(page,310,false);await width(page,310);await page.keyboard.press('Escape');await width(page,200);await page.mouse.up();expect(await page.evaluate(()=>localStorage.getItem('hust-sidebar-width'))).toBe('200');await expect(page.locator('html')).not.toHaveAttribute('data-sidebar-resizing');
 await expect(page.locator('#message')).toHaveValue('Bản nháp đang viết');expect(await page.evaluate(()=>localStorage.getItem('hust-conversations-v2'))).toBe(history);
 await rail(page).dblclick();await width(page,232);await page.reload();await width(page,232);await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','1');expect(errors).toEqual([]);
});

test('keyboard bounds, persistence and viewport cap preserve the preferred width across phone mode',async({page})=>{
 await page.goto('/');await rail(page).focus();await page.keyboard.press('ArrowRight');await width(page,242);await page.keyboard.press('ArrowLeft');await width(page,232);await page.keyboard.press('Home');await width(page,200);await page.keyboard.press('End');await width(page,360);await page.reload();await width(page,360);
 await page.setViewportSize({width:768,height:844});await width(page,268);await expect(rail(page)).toHaveAttribute('aria-valuemax','268');expect(await page.evaluate(()=>localStorage.getItem('hust-sidebar-width'))).toBe('360');
 await page.setViewportSize({width:390,height:844});await expect(rail(page)).not.toBeVisible();expect((await page.locator('.composer-dock').boundingBox())!.x).toBe(0);
 await page.setViewportSize({width:1440,height:1000});await width(page,360);await rail(page).focus();await page.keyboard.press('ArrowRight');await width(page,360);
});

for(const theme of ['light','dark'])test(`long titles fit without horizontal scroll, retain font size and remain actionable (${theme})`,async({page})=>{
 await page.goto('/');if(theme==='dark')await page.getByRole('button',{name:'Chuyển chế độ giao diện tối'}).click();await send(page,full);await page.getByRole('button',{name:'Hội thoại mới',exact:true}).click();await send(page,'Tôi sắp đi công tác bằng kinh phí đơn vị.');await openHistory(page);
 const entry=page.locator('.sidebar .history-open').filter({hasText:'Tôi chuẩn bị tham dự'});const title=await entry.getAttribute('title');expect(title!.length).toBeGreaterThan(50);const font=await entry.locator('span').evaluate(e=>getComputedStyle(e).fontSize);
 for(const n of [200,360]){await drag(page,n);await width(page,n);const metrics=await entry.locator('span').evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth,overflow:getComputedStyle(e).textOverflow,font:getComputedStyle(e).fontSize}));expect(metrics.overflow).toBe('ellipsis');expect(metrics.font).toBe(font);if(n===200)expect(metrics.scroll).toBeGreaterThan(metrics.client);expect(await page.locator('.sidebar-content').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);const row=await entry.locator('..').boundingBox();const del=await entry.locator('..').locator('.history-delete').boundingBox();expect(del!.x+del!.width).toBeLessThanOrEqual(row!.x+row!.width);await settleVisuals(page);await page.screenshot({path:`${dir}/history-${theme}-${n}.png`});}
 await entry.click();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','1');await page.locator('.sidebar .history-row.selected .history-delete').click();await expect(page.locator('.sidebar .history-open')).toHaveCount(1);await page.getByRole('button',{name:'Khôi phục',exact:true}).click();await expect(page.locator('.sidebar .history-open')).toHaveCount(2);
});

for(const theme of ['light','dark'])test(`header, composer and situation panel stay aligned at width limits (${theme})`,async({page})=>{
 await page.setViewportSize({width:1280,height:1024});await page.goto('/');if(theme==='dark')await page.getByRole('button',{name:'Chuyển chế độ giao diện tối'}).click();await send(page,full);
 for(const n of [200,360]){await drag(page,n);await openContext(page);const top=(await page.locator('.topbar').boundingBox())!,dock=(await page.locator('.composer-dock').boundingBox())!,panel=(await page.locator('.context-panel').boundingBox())!;expect(top.x).toBe(n);expect(dock.x).toBe(n);expect(dock.x+dock.width).toBe(panel.x);const actions=(await page.locator('.topbar-actions').boundingBox())!,label=(await page.locator('.topbar>div').first().boundingBox())!;expect(label.x+label.width).toBeLessThanOrEqual(actions.x);expect(actions.x+actions.width).toBeLessThanOrEqual(top.x+top.width);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.getByText('Chỉ cần thông tin của tình huống, không cần dữ liệu cá nhân.',{exact:true})).toHaveCount(0);await settleVisuals(page);await page.screenshot({path:`${dir}/layout-${theme}-${n}.png`});await page.locator('.panel-close').click();await expect(page.locator('.context-panel')).toHaveCount(0);}
 await page.setViewportSize({width:1024,height:844});await openContext(page);expect((await page.locator('.context-backdrop').boundingBox())!.x).toBe(358);await page.keyboard.press('Escape');
 const sendBox=(await page.getByRole('button',{name:'Gửi câu hỏi'}).boundingBox())!,form=(await page.locator('.composer').boundingBox())!;expect(form.x+form.width-sendBox.x-sendBox.width).toBeLessThan(20);
});

test('unavailable storage, malformed preferences and pointer cancellation leave resizing usable',async({browser})=>{
 for(const saved of ['bad-value','999','-5']){const context=await browser.newContext();const p=await context.newPage();await p.addInitScript(value=>localStorage.setItem('hust-sidebar-width',value),saved);await p.goto('/');await width(p,saved==='bad-value'?232:saved==='999'?360:200);await context.close();}
 const context=await browser.newContext(),p=await context.newPage();await p.addInitScript(()=>{const get=Storage.prototype.getItem,set=Storage.prototype.setItem;Storage.prototype.getItem=function(k){if(k==='hust-sidebar-width')throw new DOMException('Blocked','SecurityError');return get.call(this,k);};Storage.prototype.setItem=function(k,v){if(k==='hust-sidebar-width')throw new DOMException('Blocked','SecurityError');return set.call(this,k,v);};});await p.goto('/');await drag(p,300);await width(p,300);await drag(p,340,false);await rail(p).dispatchEvent('pointercancel');await width(p,300);await p.mouse.up();await rail(p).focus();await p.keyboard.press('ArrowLeft');await width(p,290);await context.close();
});

test('removing the helper line preserves the 24-turn message and disabled send control',async({page})=>{
 await page.goto('/');await send(page,full);
 await page.evaluate(()=>{const records=JSON.parse(localStorage.getItem('hust-conversations-v2')!);const first=records[0].turns[0];records[0].turns=Array.from({length:24},(_,i)=>({user:first.user,answer:{...first.answer,turn:i+1}}));localStorage.setItem('hust-conversations-v2',JSON.stringify(records));});await page.reload();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','24');await expect(page.locator('.composer-limit')).toContainText('Đã đủ 24 lượt. Hãy bắt đầu hội thoại mới.');await page.locator('#message').fill('Câu tiếp theo');await expect(page.getByRole('button',{name:'Gửi câu hỏi'})).toBeDisabled();
});
