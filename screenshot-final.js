const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/final-screenshots';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  // === DESKTOP ===
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  async function go(url, label) {
    console.log(label);
    try { await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); await p.waitForTimeout(3000); }
    catch (e) { console.log('  WARN: ' + e.message.substring(0, 60)); }
  }

  // 1. Desktop home
  await go('http://localhost:3458/', '01 desktop home');
  await p.screenshot({ path: out + '/01-desktop-home.png' });

  // 2. Demo modal
  const demoBtn = await p.$('button:has(svg.lucide-sparkles)');
  if (demoBtn) { await demoBtn.click(); await p.waitForTimeout(1000); }
  await p.screenshot({ path: out + '/02-demo-modal.png' });
  // Close modal
  const closeBtn = await p.$('.fixed.inset-0 button:has(svg.lucide-x)');
  if (closeBtn) await closeBtn.click();
  await p.waitForTimeout(500);

  // 3. Demo highlight home
  await p.evaluate(() => { localStorage.setItem('demoMode', 'true'); localStorage.setItem('demoModeStep', '0'); });
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(3000);
  await p.screenshot({ path: out + '/03-demo-highlight-home.png' });
  await p.evaluate(() => { localStorage.removeItem('demoMode'); localStorage.removeItem('demoModeStep'); });

  // 4. Sector detail
  await go('http://localhost:3458/sectors/optical-communication', '04 sector detail');
  await p.screenshot({ path: out + '/04-sector-detail.png' });

  // 5. Sector demo highlight
  await p.evaluate(() => { localStorage.setItem('demoMode', 'true'); localStorage.setItem('demoModeStep', '1'); });
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  await p.screenshot({ path: out + '/05-sector-demo-highlight.png' });
  await p.evaluate(() => { localStorage.removeItem('demoMode'); localStorage.removeItem('demoModeStep'); });

  // 6. Stock candlestick
  await go('http://localhost:3458/stocks/300308', '06 stock candlestick');
  await p.waitForTimeout(2000);
  await p.screenshot({ path: out + '/06-stock-candlestick.png' });

  // 7. Stock area chart
  const areaBtn = await p.$('button:text("面积")');
  if (areaBtn) { await areaBtn.click(); await p.waitForTimeout(1500); }
  await p.screenshot({ path: out + '/07-stock-area.png' });

  // 8. Volume off
  const volBtn = await p.$('button:text("成交量")');
  if (volBtn) { await volBtn.click(); await p.waitForTimeout(1000); }
  await p.screenshot({ path: out + '/08-volume-off.png' });
  // Turn volume back on
  if (volBtn) { await volBtn.click(); await p.waitForTimeout(500); }

  // 9. Trade panel buy
  // Switch back to candlestick first
  const candleBtn = await p.$('button:text("蜡烛")');
  if (candleBtn) { await candleBtn.click(); await p.waitForTimeout(1000); }
  const buyBtn = await p.$('button:text("买入")');
  if (buyBtn) { await buyBtn.click(); await p.waitForTimeout(1500); }
  await p.screenshot({ path: out + '/09-trade-panel-buy.png' });

  // 10. Trade filled
  const confirmBtn = await p.$('.fixed button:text("确认买入")');
  if (confirmBtn) { await confirmBtn.click(); await p.waitForTimeout(5000); }
  await p.screenshot({ path: out + '/10-trade-filled.png' });

  // Close panel
  const closeBtn2 = await p.$('.fixed button:text("关闭")');
  if (closeBtn2) { await closeBtn2.click(); await p.waitForTimeout(500); }

  // 11. Orders with data
  await go('http://localhost:3458/orders', '11 orders');
  await p.screenshot({ path: out + '/11-orders-with-data.png' });

  // 12. Error: invalid sector
  await go('http://localhost:3458/sectors/nonexistent', '12 error sector');
  await p.waitForTimeout(1000);
  await p.screenshot({ path: out + '/12-error-invalid-sector.png' });

  // 13. Error: invalid stock
  await go('http://localhost:3458/stocks/999999', '13 error stock');
  await p.waitForTimeout(1000);
  await p.screenshot({ path: out + '/13-error-invalid-stock.png' });

  // === MOBILE ===
  const mc = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mc.newPage();
  async function mg(url, label) {
    console.log(label);
    try { await mp.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); await mp.waitForTimeout(2000); }
    catch (e) { console.log('  WARN: ' + e.message.substring(0, 60)); }
  }

  // 14. Mobile home
  await mg('http://localhost:3458/mobile', '14 mobile home');
  await mp.screenshot({ path: out + '/14-mobile-home.png' });

  // 15. Mobile sector
  await mg('http://localhost:3458/mobile/sectors/optical-communication', '15 mobile sector');
  await mp.screenshot({ path: out + '/15-mobile-sector.png' });

  // 16. Mobile trade
  await mg('http://localhost:3458/mobile/trade/300308', '16 mobile trade');
  await mp.waitForTimeout(2000);
  await mp.screenshot({ path: out + '/16-mobile-trade.png' });

  // 17. Mobile filled - click buy and submit
  const mbuy = await mp.$$('button');
  for (const b of mbuy) { const t = await b.textContent(); if (t && t.includes('买入')) { await b.click(); break; } }
  await mp.waitForTimeout(1500);
  const mconfirm = await mp.$('.fixed button:has-text("确认买入")');
  if (mconfirm) { await mconfirm.click(); await mp.waitForTimeout(5000); }
  await mp.screenshot({ path: out + '/17-mobile-filled.png' });

  // 18. Mobile error
  await mg('http://localhost:3458/mobile/sectors/nonexistent', '18 mobile error');
  await mp.waitForTimeout(1000);
  await mp.screenshot({ path: out + '/18-mobile-error.png' });

  await browser.close();
  console.log('\n=== Final screenshots done ===');
})();
