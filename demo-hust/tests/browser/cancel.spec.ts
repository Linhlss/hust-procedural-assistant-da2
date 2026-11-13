import {test,expect} from '@playwright/test';
for(const width of [1440,390])test(`cancel remains accessible and preserves the draft at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');
 let release!:()=>void;const pending=new Promise<void>(resolve=>{release=resolve;});
 await page.route('**/api/chat',async route=>{await pending;await route.abort().catch(()=>{});});
 try{
  await page.locator('#message').fill('Tôi muốn tham dự hội thảo.');await page.getByRole('button',{name:'Gửi câu hỏi',exact:true}).click();
  const cancel=page.getByRole('button',{name:'Hủy',exact:true});await expect(cancel).toBeVisible();await expect(page.locator('.processing-status')).toContainText('Hủy');
  await cancel.focus();await expect(cancel).toBeFocused();await cancel.press('Enter');
  await expect(page.locator('.conversation')).toHaveAttribute('data-message-count','0');await expect(page.locator('#message')).toHaveValue('Tôi muốn tham dự hội thảo.');await expect(cancel).toHaveCount(0);await expect(page.locator('.pending-turn')).toHaveCount(0);
 }finally{release();}
});
