import {test,expect} from './session';
import {settleVisuals} from './helpers';
const full='Tôi dự hội thảo ở Hà Nội ngày 20/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ. Tôi cần chuẩn bị giấy tờ gì?';
const narrative='Trước khi đi, chuẩn bị giấy mời hoặc chương trình và kế hoạch tham dự; bổ sung mô tả hoạt động liên quan đến nhiệm vụ. Sau hoạt động, giữ xác nhận tham dự và chứng từ phát sinh theo hướng dẫn nguồn mẫu.';
for(const theme of ['light','dark'])for(const width of [1440,390])test(`one main narrative, expandable conditions, copy and history (${theme}, ${width})`,async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.setViewportSize({width,height:1000});await page.addInitScript(theme=>localStorage.setItem('hust-ui-theme',theme),theme);
 await page.route('**/api/chat',async route=>{
  const response=await route.fetch();const data=await response.json();expect(response.status()).toBe(200);
  data.answer.mode='gemini';data.answer.narrative={model:'ui-mock-not-live',paragraphs:[{text:narrative,sourceIds:['SIM-HD-DOCS','SIM-NV-PREP']}]};
  data.answer.summary+='\nDiễn giải Gemini:\n'+narrative;
  await route.fulfill({json:data});
 });
 await page.goto('/');await page.locator('#message').fill(full);await page.getByRole('button',{name:'Gửi câu hỏi',exact:true}).click();
 const main=page.getByLabel('Phản hồi theo ngữ cảnh');await expect(main).toContainText(narrative);
 const toggle=page.getByLabel('Điều kiện và căn cứ',{exact:true});await expect(toggle).toHaveAttribute('aria-expanded','false');
 await expect(page.locator('.condition-details .answer-content')).not.toBeVisible();
 await page.getByRole('button',{name:'Sao chép tóm tắt',exact:true}).click();const copy=await page.evaluate(()=>navigator.clipboard.readText());
 expect(copy.split(narrative).length-1).toBe(1);expect(copy).not.toContain('Diễn giải Gemini:');expect(copy).toContain('SIM-HD-DOCS');
 await toggle.click();await expect(page.locator('.condition-details .answer-content')).toBeVisible();await toggle.press('Escape');await expect(toggle).toHaveAttribute('aria-expanded','false');
 await main.locator('.citation-ref').first().click();await expect(page.locator('.source:focus')).toHaveAttribute('data-source-id','SIM-HD-DOCS');
 await page.reload();await expect(main).toContainText(narrative);await expect(toggle).toHaveAttribute('aria-expanded','false');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hust-conversations-v2')??'[]')[0].turns[0].answer);expect(saved.knowledge.kind).toBe('synthetic_fixture');
 await settleVisuals(page);await page.screenshot({path:`${process.env.HUST_TEST_ARTIFACT_DIR}/one-answer-${theme}-${width}.png`,fullPage:true});
});
