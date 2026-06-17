const { chromium } = require('playwright');
const fs = require('fs');
const out = 'final-delivery/p4-a-trading-product-reality-pass/04-after-screenshots';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  // --- 1. Full homepage (1440x900) ---
  console.log('01 homepage full...');
  const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p1 = await ctx1.newPage();
  await p1.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p1.waitForTimeout(3000);
  await p1.screenshot({ path: `${out}/01-homepage-full.png`, fullPage: true });
  console.log('01 done');

  // --- 2. Sector cards zoomed ---
  console.log('02 sector cards...');
  const sectors = await p1.locator('text=热门板块').first();
  if (await sectors.isVisible()) {
    await sectors.scrollIntoViewIfNeeded();
    await p1.waitForTimeout(500);
    const box = await sectors.boundingBox();
    if (box) {
      await p1.screenshot({
        path: `${out}/02-sector-cards.png`,
        clip: { x: 0, y: box.y - 20, width: 1440, height: 500 }
      });
      console.log('02 done');
    }
  }
  await ctx1.close();

  // --- 3. Sector detail page ---
  console.log('03 sector detail...');
  const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p3 = await ctx3.newPage();
  await p3.goto('http://localhost:3458/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 30000 });
  await p3.waitForTimeout(3000);
  await p3.screenshot({ path: `${out}/03-sector-detail.png`, fullPage: true });
  console.log('03 done');
  await ctx3.close();

  // --- 4. Stock detail with MA indicators ---
  console.log('04 stock detail...');
  const ctx4 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p4 = await ctx4.newPage();
  await p4.goto('http://localhost:3458/stocks/300308', { waitUntil: 'networkidle', timeout: 30000 });
  await p4.waitForTimeout(4000);
  await p4.screenshot({ path: `${out}/04-stock-detail.png`, fullPage: true });
  console.log('04 done');

  // --- 5. Trade panel ---
  console.log('05 trade panel...');
  // Look for trade panel or buy button
  const tradePanel = await p4.locator('[class*="trade"], [class*="Trade"]').first();
  if (await tradePanel.isVisible()) {
    await tradePanel.scrollIntoViewIfNeeded();
    await p4.waitForTimeout(500);
    const box = await tradePanel.boundingBox();
    if (box) {
      await p4.screenshot({
        path: `${out}/05-trade-panel.png`,
        clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 20), width: box.width + 40, height: box.height + 40 }
      });
      console.log('05 done (clipped)');
    }
  } else {
    // Try scrolling down to find trade panel
    await p4.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p4.waitForTimeout(1000);
    await p4.screenshot({ path: `${out}/05-trade-panel.png`, fullPage: false });
    console.log('05 done (scrolled)');
  }
  await ctx4.close();

  // --- 6. Trade confirmation dialog ---
  console.log('06 trade confirm...');
  const ctx6 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p6 = await ctx6.newPage();
  await p6.goto('http://localhost:3458/stocks/300308', { waitUntil: 'networkidle', timeout: 30000 });
  await p6.waitForTimeout(3000);
  // Try to find and click buy button
  const buyBtn = await p6.locator('button:has-text("买入"), button:has-text("买"), [class*="buy"]').first();
  if (await buyBtn.count() > 0 && await buyBtn.isVisible()) {
    // Enter quantity first
    const qtyInput = await p6.locator('input[type="number"], input[placeholder*="数量"], input[placeholder*="手"]').first();
    if (await qtyInput.count() > 0) {
      await qtyInput.fill('10');
      await p6.waitForTimeout(300);
    }
    await buyBtn.click();
    await p6.waitForTimeout(1500);
    await p6.screenshot({ path: `${out}/06-trade-confirm.png`, fullPage: false });
    console.log('06 done (with dialog)');
  } else {
    await p6.screenshot({ path: `${out}/06-trade-panel.png` });
    console.log('06 done (no dialog found, captured page)');
  }
  await ctx6.close();

  // --- 7. Orders page empty ---
  console.log('07 orders empty...');
  const ctx7 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p7 = await ctx7.newPage();
  // Clear localStorage
  await p7.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p7.evaluate(() => localStorage.clear());
  await p7.goto('http://localhost:3458/orders', { waitUntil: 'networkidle', timeout: 30000 });
  await p7.waitForTimeout(2000);
  await p7.screenshot({ path: `${out}/07-orders-empty.png`, fullPage: true });
  console.log('07 done');
  await ctx7.close();

  // --- 8. Risk warning (寒武纪 688256) ---
  console.log('08 risk warning...');
  const ctx8 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p8 = await ctx8.newPage();
  await p8.goto('http://localhost:3458/stocks/688256', { waitUntil: 'networkidle', timeout: 30000 });
  await p8.waitForTimeout(3000);
  await p8.screenshot({ path: `${out}/08-risk-warning.png`, fullPage: true });
  console.log('08 done');
  await ctx8.close();

  // --- 9. Mobile homepage (375x812) ---
  console.log('09 mobile homepage...');
  const ctx9 = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const p9 = await ctx9.newPage();
  await p9.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p9.waitForTimeout(3000);
  await p9.screenshot({ path: `${out}/09-mobile-homepage.png`, fullPage: true });
  console.log('09 done');
  await ctx9.close();

  // --- 10. Market sentiment ---
  console.log('10 market sentiment...');
  const ctx10 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p10 = await ctx10.newPage();
  await p10.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p10.waitForTimeout(3000);
  // Look for sentiment section
  const sentiment = await p10.locator('text=市场情绪, text=情绪').first();
  if (await sentiment.count() > 0 && await sentiment.isVisible()) {
    await sentiment.scrollIntoViewIfNeeded();
    await p10.waitForTimeout(500);
    const box = await sentiment.boundingBox();
    if (box) {
      await p10.screenshot({
        path: `${out}/10-market-sentiment.png`,
        clip: { x: 0, y: Math.max(0, box.y - 30), width: 1440, height: 600 }
      });
      console.log('10 done (clipped)');
    }
  } else {
    // Just capture bottom part of homepage
    await p10.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await p10.waitForTimeout(500);
    await p10.screenshot({ path: `${out}/10-market-sentiment.png` });
    console.log('10 done (fallback)');
  }
  await ctx10.close();

  await browser.close();
  console.log('All screenshots done!');
})();
