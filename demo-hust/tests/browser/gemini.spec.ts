import {test,expect} from './session';
const full='Tôi dự hội thảo ở Hà Nội ngày 20/11/2026, kinh phí nhiệm vụ, có phục vụ nhiệm vụ.';
for(const mobile of [false,true])test(`Gemini narrative mock renders citations, persists and handles quota (${mobile?'mobile':'desktop'})`,async({page})=>{
 if(mobile)await page.setViewportSize({width:390,height:844});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 let count=0;
 await page.route('**/api/chat',async route=>{
  const request=route.request().postDataJSON();count++;
  if(count>1){await route.fulfill({status:429,json:{code:'GEMINI_QUOTA',error:'Gemini đã chạm hạn mức miễn phí. Dữ kiện đang có được giữ nguyên.'}});return;}
  const response=await route.fetch();const data=await response.json();
  data.answer.mode='gemini';data.answer.narrative={model:'browser-mock-not-live',paragraphs:[{text:'Bạn cho biết đã giữ xác nhận tham dự. Hãy tập trung chứng từ phát sinh và trao đổi với đầu mối tài chính.',sourceIds:['SIM-HD-DOCS']}]};
  await route.fulfill({json:data});
 });
 await page.goto('/');await page.getByLabel('Nhập tình huống hoặc sửa dữ kiện').fill(full);await page.getByRole('button',{name:'Gửi câu hỏi',exact:true}).click();
 await expect(page.getByLabel('Phản hồi theo ngữ cảnh')).toContainText('đã giữ xác nhận tham dự');await expect(page.locator('.assistant-mode').last()).toHaveText('Gemini');
 await page.locator('.answer-narrative .citation-ref').click();await expect(page.locator('.source:focus')).toHaveAttribute('data-source-id','SIM-HD-DOCS');
 await page.reload();await expect(page.getByLabel('Phản hồi theo ngữ cảnh')).toContainText('đã giữ xác nhận tham dự');
 await page.getByLabel('Nhập tình huống hoặc sửa dữ kiện').fill('Tôi sửa ngày thành 21/11/2026.');await page.getByRole('button',{name:'Gửi câu hỏi',exact:true}).click();
 await expect(page.locator('.error')).toContainText('hạn mức miễn phí');await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','1');
 await expect(page.getByLabel('Phản hồi theo ngữ cảnh')).toContainText('đã giữ xác nhận tham dự');expect(errors).toEqual([]);
});
