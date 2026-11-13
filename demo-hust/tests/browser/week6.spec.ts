import { settleVisuals } from './helpers';
import { test,expect,type Page } from '@playwright/test';
const dir=process.env.HUST_TEST_ARTIFACT_DIR??'artifacts/demo-runs/week6-model-preparation-2026-11-07';
const full='Hội thảo tại Hà Nội ngày 15/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
async function send(page:Page,text:string){
 const count=Number(await page.locator('.conversation').getAttribute('data-message-count'));
 await page.getByLabel('Nhập tình huống hoặc sửa dữ kiện').fill(text);
 await page.getByRole('button',{name:'Gửi câu hỏi'}).click();
 await expect(page.locator('.conversation')).toHaveAttribute('data-message-count',String(count+1));
}

for(const mobile of [false,true]) {
 const surface=mobile?'phone':'desktop';
 test(`current facts, source changes and evidence remain clear (${surface})`,async({page})=>{
  if(mobile)await page.setViewportSize({width:390,height:844});await page.goto('/');await send(page,full);
  const current=page.locator('.is-current-response');
  await expect(current.locator('.current-response-heading')).toContainText('Hướng dẫn hiện hành');
  await current.getByRole('button',{name:'Xem dữ kiện'}).click();await expect(page.locator('.context-panel')).toBeVisible();
  await expect(page.getByRole('region',{name:'Dữ kiện hiện tại'})).toContainText('Kinh phí nhiệm vụ');
  await page.locator('.context-panel').getByRole('button',{name:'Đóng không gian tình huống',exact:true}).click();
  await send(page,'Tôi chuyển sang kinh phí đơn vị, thay thế hoàn toàn nguồn nhiệm vụ.');
  await expect(page.locator('.is-current-response')).toHaveCount(1);
  await current.getByRole('button',{name:'Xem dữ kiện'}).click();
  await expect(page.locator('.context-panel .current-fact[data-field=funding]')).toContainText('Kinh phí đơn vị');
  await expect(page.locator('.context-panel .current-fact[data-field=funding]')).toHaveClass(/is-updated/);
  await expect(current.locator('.revision')).toHaveAttribute('open','');
  await expect(current.locator('.revision')).toContainText('Không còn áp dụng');
  await expect(current.locator('.conclusion').filter({hasText:'Điều kiện liên hệ nhiệm vụ'})).toHaveCount(0);
  await page.locator('.panel-close').click();await expect(page.locator('.context-panel')).toHaveCount(0);
  await page.locator('.historical').getByRole('button',{name:'Đến hướng dẫn hiện hành'}).click();
  await expect(current.locator('.current-response-heading')).toBeInViewport();
  await settleVisuals(page);await page.screenshot({path:`${dir}/week6-current-${surface}.png`,fullPage:true});
  await current.locator('.conclusion').filter({hasText:'Điều kiện địa điểm chung'}).getByRole('button',{name:'Xem căn cứ',exact:false}).click();
  await expect(current.locator('[data-source-id=SIM-CT-2026]')).toBeFocused();
  expect(await current.locator('.source blockquote').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(12);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await settleVisuals(page);await page.screenshot({path:`${dir}/week6-evidence-${surface}.png`,fullPage:true});
 });

 test(`pending question is reachable from the composer and withdrawn date is visible (${surface})`,async({page})=>{
  if(mobile)await page.setViewportSize({width:390,height:844});await page.goto('/');
  await send(page,'Tôi muốn đi hội thảo');
  await expect(page.getByRole('button',{name:'Xem câu hỏi đang chờ'})).toBeVisible();
  await expect(page.locator('.question-reminder')).toContainText('nguồn kinh phí');
  await page.getByRole('button',{name:'Xem câu hỏi đang chờ'}).click();
  await expect(page.locator('.is-current-response .question h3')).toBeInViewport();
  await send(page,'Kinh phí nhiệm vụ');await send(page,'Trong nước');await send(page,'15/11/2026');await send(page,'Có');
  await expect(page.locator('.question-reminder')).toHaveCount(0);
  await send(page,'Sửa ngày thành 31/02/2026.');
  await expect(page.locator('.question-reminder')).toContainText('ngày nào');
  await page.getByRole('button',{name:'Không gian tình huống',exact:true}).click();
  const date=page.locator('.context-panel .current-fact[data-field=date]');
  await expect(date).toContainText('Chưa xác định');await expect(date).toHaveClass(/is-updated/);
  await expect(page.locator('.context-panel .current-fact[data-field=location]')).toContainText('Trong nước');
  await expect(page.locator('.context-panel .current-fact[data-field=funding]')).toContainText('Kinh phí nhiệm vụ');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await settleVisuals(page);await page.screenshot({path:`${dir}/week6-question-${surface}.png`,fullPage:true});
 });
}

test('a pending situation displays its own facts without presenting the old date as current',async({page})=>{
 await page.goto('/');await send(page,full);await send(page,'Một hội thảo khác ở Nhật Bản thì sao?');
 await page.getByRole('button',{name:'Không gian tình huống',exact:true}).click();
 const pending=page.getByRole('region',{name:'Dữ kiện đang chờ xác nhận'});
 await expect(pending).toContainText('Nước ngoài');await expect(pending).not.toContainText('2026-11-15');
 await expect(pending).not.toContainText('Kinh phí nhiệm vụ');
 await expect(page.locator('.is-current-response .question')).toContainText('tình huống mới');
 await settleVisuals(page);await page.screenshot({path:`${dir}/week6-pending-situation.png`,fullPage:true});
});
