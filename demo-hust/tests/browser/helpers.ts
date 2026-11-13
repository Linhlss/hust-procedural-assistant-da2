import { expect,type Page } from '@playwright/test';
export async function openContext(page:Page){if(await page.locator('.context-panel').count()===0)await page.getByRole('button',{name:'Không gian tình huống',exact:true}).click();await expect(page.locator('.context-panel')).toBeVisible();await expect(page.locator('.context-panel')).toHaveAttribute('data-motion-state','idle');}

export async function openHistory(page:Page){const button=page.locator('.sidebar .history-disclosure');if(await button.getAttribute('aria-expanded')==='false')await button.click();await expect(button).toHaveAttribute('aria-expanded','true');await expect(page.locator('#desktop-history-list')).toHaveAttribute('data-motion-state','idle');}

export async function settleVisuals(page:Page){
 await expect(page.locator('.animated-collapse[data-motion-state="moving"],.context-panel[data-motion-state="moving"],.mobile-history[data-motion-state="moving"]')).toHaveCount(0);
 await page.evaluate(async()=>{await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
}
