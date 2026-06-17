const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p1e-polish';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  async function gotoAndWait(url, label) {
    console.log(label);
    try { await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); await p.waitForTimeout(3000); }
    catch (e) { console.log('  WARN: ' + e.message.substring(0, 80)); }
  }

  // 1. First do a trade to populate orders
  await gotoAndWait('http://localhost:3458/stocks/300308', 'setup: stock page');
  // Click buy
  const buyBtn = await p.$('[data-demo-highlight="buy-button"]');
  if (buyBtn) { await buyBtn.click(); await p.waitForTimeout(1500); }
  else {
    const btns = await p.$$('button');
    for (const b of btns) { const t = await b.textContent(); if (t && t.includes('买入') && !t.includes('卖出')) { await b.click(); break; } }
    await p.waitForTimeout(1500);
  }

  // Confirm buy
  const confirmBtn = await p.$('[data-demo-highlight="confirm-buy"]');
  if (confirmBtn) { await confirmBtn.click(); await p.waitForTimeout(5000); }
  else {
    const btns2 = await p.$$('.fixed button');
    for (const b of btns2) { const t = await b.textContent(); if (t && t.includes('确认买入')) { await b.click(); break; } }
    await p.waitForTimeout(5000);
  }

  // 1. Trade filled with "查看订单"
  await p.screenshot({ path: out + '/01-trade-filled-view-orders.png', fullPage: false });
  console.log('01 trade filled with view orders');

  // Navigate to orders
  const viewOrdersBtn = await p.$('[data-demo-highlight="view-orders"]');
  if (viewOrdersBtn) { await viewOrdersBtn.click(); await p.waitForTimeout(2000); }
  else { await gotoAndWait('http://localhost:3458/orders', 'fallback: orders'); }

  // 2. Orders page with data
  await p.screenshot({ path: out + '/02-orders-with-data.png', fullPage: false });
  console.log('02 orders with data');

  // 3. Orders empty state - clear localStorage and reload
  await p.evaluate(() => localStorage.removeItem('nexus-trade-orders'));
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  await p.screenshot({ path: out + '/03-orders-empty.png', fullPage: false });
  console.log('03 orders empty');

  // 4. Demo highlight on homepage
  await gotoAndWait('http://localhost:3458/', 'setup: homepage');
  // Activate demo mode
  await p.evaluate(() => { localStorage.setItem('demoMode', 'true'); localStorage.setItem('demoModeStep', '0'); });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: out + '/04-demo-highlight-home.png', fullPage: false });
  console.log('04 demo highlight home');

  // 5. Demo highlight sector detail
  await p.evaluate(() => { localStorage.setItem('demoModeStep', '1'); });
  await gotoAndWait('http://localhost:3458/sectors/optical-communication', 'demo step 2: sector');
  await p.waitForTimeout(2000);
  await p.screenshot({ path: out + '/05-demo-highlight-sector.png', fullPage: false });
  console.log('05 demo highlight sector');

  // 6. Demo highlight chart type switcher
  await p.evaluate(() => { localStorage.setItem('demoModeStep', '2'); });
  await gotoAndWait('http://localhost:3458/stocks/300308', 'demo step 3: stock');
  await p.waitForTimeout(3000);
  await p.screenshot({ path: out + '/06-demo-highlight-chart.png', fullPage: false });
  console.log('06 demo highlight chart');

  // 7. Demo highlight buy button
  await p.evaluate(() => { localStorage.setItem('demoModeStep', '3'); });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  await p.screenshot({ path: out + '/07-demo-highlight-buy.png', fullPage: false });
  console.log('07 demo highlight buy');

  // 8. ErrorState: invalid sector
  await p.evaluate(() => { localStorage.removeItem('demoMode'); localStorage.removeItem('demoModeStep'); });
  await gotoAndWait('http://localhost:3458/sectors/nonexistent', 'error: invalid sector');
  await p.waitForTimeout(1000);
  await p.screenshot({ path: out + '/08-error-invalid-sector.png', fullPage: false });
  console.log('08 error invalid sector');

  // 9. ErrorState: invalid stock
  await gotoAndWait('http://localhost:3458/stocks/999999', 'error: invalid stock');
  await p.waitForTimeout(1000);
  await p.screenshot({ path: out + '/09-error-invalid-stock.png', fullPage: false });
  console.log('09 error invalid stock');

  await browser.close();
  console.log('\n=== P1-E-Polish screenshots done ===');
})();
