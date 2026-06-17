const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/online-screenshots';
fs.mkdirSync(out, { recursive: true });
const BASE = 'https://stock-trading-demo.vercel.app';

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  async function go(url, label) {
    console.log(label);
    try { await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); await p.waitForTimeout(3000); }
    catch (e) { console.log('  WARN: ' + e.message.substring(0, 60)); }
  }

  // 1. Desktop home
  await go(BASE + '/', '01 desktop home');
  await p.screenshot({ path: out + '/01-desktop-home.png' });

  // 2. Demo modal
  const demoBtn = await p.$('button:has(svg.lucide-sparkles)');
  if (demoBtn) { await demoBtn.click(); await p.waitForTimeout(1000); }
  await p.screenshot({ path: out + '/02-demo-modal.png' });
  const closeBtn = await p.$('.fixed.inset-0 button:has(svg.lucide-x)');
  if (closeBtn) await closeBtn.click();
  await p.waitForTimeout(500);

  // 3. Sector detail
  await go(BASE + '/sectors/optical-communication', '03 sector detail');
  await p.screenshot({ path: out + '/03-sector-detail.png' });

  // 4. Stock candlestick
  await go(BASE + '/stocks/300308', '04 stock candlestick');
  await p.waitForTimeout(2000);
  await p.screenshot({ path: out + '/04-stock-candlestick.png' });

  // 5. Trade panel
  const buyBtn = await p.$('button:text("买入")');
  if (buyBtn) { await buyBtn.click(); await p.waitForTimeout(1500); }
  await p.screenshot({ path: out + '/05-trade-panel.png' });

  // 6. Trade filled
  const confirmBtn = await p.$('.fixed button:text("确认买入")');
  if (confirmBtn) { await confirmBtn.click(); await p.waitForTimeout(5000); }
  await p.screenshot({ path: out + '/06-trade-filled.png' });

  // 7. Orders with data
  const viewBtn = await p.$('button:text("查看订单")');
  if (viewBtn) { await viewBtn.click(); await p.waitForTimeout(2000); }
  else { await go(BASE + '/orders', 'fallback orders'); }
  await p.screenshot({ path: out + '/07-orders-with-data.png' });

  // 8. ErrorState
  await go(BASE + '/sectors/nonexistent', '08 error state');
  await p.waitForTimeout(1000);
  await p.screenshot({ path: out + '/08-error-state.png' });

  // Mobile
  const mc = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mc.newPage();
  async function mg(url, label) {
    console.log(label);
    try { await mp.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); await mp.waitForTimeout(2000); }
    catch (e) { console.log('  WARN: ' + e.message.substring(0, 60)); }
  }

  // 9. Mobile home
  await mg(BASE + '/mobile', '09 mobile home');
  await mp.screenshot({ path: out + '/09-mobile-home.png' });

  // 10. Mobile trade
  await mg(BASE + '/mobile/trade/300308', '10 mobile trade');
  await mp.waitForTimeout(2000);
  await mp.screenshot({ path: out + '/10-mobile-trade.png' });

  await browser.close();
  console.log('\n=== Online screenshots done ===');
})();
