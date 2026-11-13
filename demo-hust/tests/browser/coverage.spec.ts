import {test,expect} from './session';
test.beforeEach(async({page})=>{const theme=process.env.FEATURE_THEME;if(theme)await page.addInitScript(value=>localStorage.setItem('hust-ui-theme',value),theme);});
for(const width of [1440,390])test(`missing spending-rate evidence is shown without asking unrelated location at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/');
 await page.getByLabel('Nhập tình huống hoặc sửa dữ kiện').fill('Tôi đi công tác ngày 20/11/2026, kinh phí đơn vị. Định mức lưu trú là bao nhiêu?');
 await page.getByRole('button',{name:'Gửi câu hỏi',exact:true}).click();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','1');
 await expect(page.getByRole('heading',{name:'Căn cứ định mức',exact:true})).toBeVisible();await expect(page.locator('.answer-intro')).toContainText('chưa đủ căn cứ');
 await expect(page.locator('.question-reminder')).toHaveCount(0);await expect(page.getByText('Bạn dự kiến sử dụng nguồn kinh phí nào?',{exact:true})).toHaveCount(0);
 await page.screenshot({path:`${process.env.HUST_TEST_ARTIFACT_DIR}/rate-evidence-${width}.png`});
});

for(const width of [1440,390])test(`withdrawing an invalid date during source lookup asks again at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/');
 const messages=['Tôi công tác tại Osaka ngày 07/08/2027, kinh phí đơn vị. Căn cứ địa điểm nào áp dụng?','Sửa ngày thành 31/11/2025, căn cứ có thay đổi không?'];
 for(let i=0;i<messages.length;i++){
  await page.getByLabel('Nhập tình huống hoặc sửa dữ kiện').fill(messages[i]);await page.getByRole('button',{name:'Gửi câu hỏi',exact:true}).click();await expect(page.locator('.conversation')).toHaveAttribute('data-message-count',String(i+1));
 }
 const latest=page.getByRole('button',{name:'Xem phản hồi mới',exact:true});if(await latest.isVisible())await latest.click();
 await expect(page.locator('.question').last().getByRole('heading')).toHaveText('Hoạt động diễn ra ngày nào?');await expect(page.locator('.question-date input').last()).toBeVisible();
 const a=await page.evaluate(()=>JSON.parse(localStorage.getItem('hust-conversations-v2')??'[]')[0].turns.at(-1).answer);
 expect(a.facts.date).toBeUndefined();expect(a.conclusions.some((c:{id:string})=>c.id==='preparation')).toBe(false);expect(a.conclusions.flatMap((c:{sources:{id:string}[]})=>c.sources).some((s:{id:string})=>s.id.startsWith('SIM-CT-'))).toBe(false);
 await page.screenshot({path:`${process.env.HUST_TEST_ARTIFACT_DIR}/date-source-${width}.png`});
});
