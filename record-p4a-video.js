const { chromium } = require('playwright');
const fs = require('fs');
const out = 'final-delivery/p4-a-trading-product-reality-pass';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: '/tmp/p4a-video', size: { width: 1440, height: 900 } }
  });
  fs.mkdirSync('/tmp/p4a-video', { recursive: true });
  const p = await ctx.newPage();

  // Step 1: Homepage (2s)
  console.log('Step 1: Homepage...');
  await p.goto('http://localhost:3458/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);

  // Step 2: Hover optical communication card (1s)
  console.log('Step 2: Hover optical communication...');
  const optical = await p.locator('text=光通信').first();
  if (await optical.isVisible()) {
    await optical.scrollIntoViewIfNeeded();
    const parent = await optical.locator('xpath=ancestor::div[contains(@class,"group")]').first();
    try { await parent.hover(); } catch {}
    await p.waitForTimeout(1000);
  }

  // Step 3: Click to enter sector detail (2s)
  console.log('Step 3: Enter sector detail...');
  if (await optical.isVisible()) {
    await optical.click();
    await p.waitForTimeout(3000);
  }

  // Step 4: Click on 中际旭创 stock (2s)
  console.log('Step 4: Click 中际旭创...');
  const zhongji = await p.locator('text=中际旭创').first();
  if (await zhongji.isVisible()) {
    await zhongji.click();
    await p.waitForTimeout(3000);
  } else {
    // Navigate directly
    await p.goto('http://localhost:3458/stocks/300308', { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(3000);
  }

  // Step 5: Show stock detail with chart (2s)
  console.log('Step 5: Stock detail...');
  await p.waitForTimeout(2000);

  // Step 6: Show trade panel (2s)
  console.log('Step 6: Trade panel...');
  await p.evaluate(() => window.scrollTo(0, 200));
  await p.waitForTimeout(1000);

  // Step 7: Enter buy quantity (2s)
  console.log('Step 7: Enter quantity...');
  const qtyInput = await p.locator('input[type="number"], input[placeholder*="数量"], input[placeholder*="手"]').first();
  if (await qtyInput.count() > 0) {
    await qtyInput.click();
    await qtyInput.fill('10');
    await p.waitForTimeout(1000);
  } else {
    await p.waitForTimeout(2000);
  }

  // Step 8: Click buy button (1s)
  console.log('Step 8: Click buy...');
  const buyBtn = await p.locator('button:has-text("买入"), button:has-text("确认买入")').first();
  if (await buyBtn.count() > 0 && await buyBtn.isVisible()) {
    await buyBtn.click();
    await p.waitForTimeout(1500);
  } else {
    // Try to find buy/confirm button
    const btns = await p.locator('button').all();
    for (const btn of btns) {
      const text = await btn.textContent();
      if (text && (text.includes('买入') || text.includes('确认'))) {
        await btn.click();
        await p.waitForTimeout(1500);
        break;
      }
    }
  }

  // Step 9: Show confirmation dialog (3s)
  console.log('Step 9: Confirmation dialog...');
  await p.waitForTimeout(3000);

  // Step 10: Confirm order (2s)
  console.log('Step 10: Confirm order...');
  const confirmBtn = await p.locator('button:has-text("确认买入"), button:has-text("确定"), button:has-text("确认")').last();
  if (await confirmBtn.count() > 0) {
    try {
      await confirmBtn.click();
    } catch {}
    await p.waitForTimeout(2000);
  } else {
    await p.waitForTimeout(2000);
  }

  // Step 11: Navigate to orders page (2s)
  console.log('Step 11: Navigate to orders...');
  await p.goto('http://localhost:3458/orders', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(2000);

  // Step 12: Show order in list (3s)
  console.log('Step 12: Order in list...');
  await p.waitForTimeout(3000);

  // Close context to finalize video
  const vPath = await p.video().path();
  await ctx.close();
  fs.copyFileSync(vPath, `${out}/trading-flow-demo.webm`);
  console.log('Video saved as trading-flow-demo.webm');

  await browser.close();
  console.log('Done!');
})();
