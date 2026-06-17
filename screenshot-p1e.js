const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const out = '/tmp/p1e-verify';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  // Desktop viewport
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  // Helper: wait for page to fully load
  async function gotoAndWait(url, label) {
    console.log(label);
    try {
      await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await p.waitForTimeout(3000);
    } catch (e) {
      console.log('  WARN: ' + e.message.substring(0, 80));
    }
  }

  // 1. Desktop home
  await gotoAndWait('http://localhost:3458/', '01 desktop home');
  await p.screenshot({ path: out + '/01-desktop-home.png', fullPage: false });

  // 2. Demo mode - click demo button in sidebar
  const demoBtn = await p.$('button:has(svg.lucide-sparkles)');
  if (demoBtn) {
    await demoBtn.click();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: out + '/03-demo-modal.png', fullPage: false });
    console.log('03 demo modal');
    // Close modal
    const closeBtn = await p.$('.fixed button:has(svg.lucide-x)');
    if (closeBtn) await closeBtn.click();
    await p.waitForTimeout(500);
  } else {
    console.log('03 demo modal - SKIP (no sparkles button found)');
  }

  // 4. Navigate to sector detail - optical-communication
  await gotoAndWait('http://localhost:3458/sectors/optical-communication', '05 sector detail');
  await p.screenshot({ path: out + '/05-sector-detail.png', fullPage: false });

  // 5. Navigate to stock detail - 300308
  await gotoAndWait('http://localhost:3458/stocks/300308', '06 stock detail candlestick');
  await p.waitForTimeout(2000); // wait for chart to load
  await p.screenshot({ path: out + '/06-stock-candlestick.png', fullPage: false });

  // 6. Click area chart type
  const areaBtn = await p.$('button:text("面积")');
  if (areaBtn) {
    await areaBtn.click();
    await p.waitForTimeout(1500);
    await p.screenshot({ path: out + '/07-chart-type-area.png', fullPage: false });
    console.log('07 chart type area');
  } else {
    console.log('07 chart type area - SKIP');
  }

  // 7. Click buy button
  const buyBtn = await p.$('button:text("买入")');
  if (buyBtn) {
    await buyBtn.click();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: out + '/08-trade-panel-buy.png', fullPage: false });
    console.log('08 trade panel buy');

    // 8. Submit trade - click confirm buy
    const confirmBtn = await p.$('.fixed button:text("确认买入")');
    if (confirmBtn) {
      await confirmBtn.click();
      await p.waitForTimeout(4000); // wait for fill animation
      await p.screenshot({ path: out + '/09-trade-filled.png', fullPage: false });
      console.log('09 trade filled');
    } else {
      console.log('09 trade filled - SKIP (no confirm button)');
    }
  } else {
    console.log('08 trade panel buy - SKIP');
    console.log('09 trade filled - SKIP');
  }

  // 10. Orders page
  await gotoAndWait('http://localhost:3458/orders', '10 orders page');
  await p.screenshot({ path: out + '/10-orders-page.png', fullPage: false });

  // Mobile screenshots
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mCtx.newPage();

  async function mGoto(url, label) {
    console.log(label);
    try {
      await mp.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await mp.waitForTimeout(2000);
    } catch (e) {
      console.log('  WARN: ' + e.message.substring(0, 80));
    }
  }

  // 11. Mobile home
  await mGoto('http://localhost:3458/mobile', '11 mobile home');
  await mp.screenshot({ path: out + '/11-mobile-home.png', fullPage: false });

  // 12. Mobile sector detail
  await mGoto('http://localhost:3458/mobile/sectors/optical-communication', '12 mobile sector');
  await mp.screenshot({ path: out + '/12-mobile-sector.png', fullPage: false });

  // 13. Mobile trade
  await mGoto('http://localhost:3458/mobile/trade/300308', '13 mobile trade');
  await mp.screenshot({ path: out + '/13-mobile-trade.png', fullPage: false });

  await browser.close();
  console.log('\n=== All screenshots done ===');
})();
