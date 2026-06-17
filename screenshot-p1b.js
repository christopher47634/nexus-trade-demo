const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const BASE = 'http://localhost:3458';
  
  console.log('=== P1-B 截图 ===\n');
  
  // 1. 桌面端板块详情页
  const sectorCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const sectorPage = await sectorCtx.newPage();
  await sectorPage.goto(`${BASE}/sectors/optical-communication`, { waitUntil: 'networkidle', timeout: 30000 });
  await sectorPage.waitForTimeout(2000);
  await sectorPage.screenshot({ path: '/tmp/p1b-desktop-sector.png', fullPage: true });
  await sectorPage.screenshot({ path: '/tmp/p1b-desktop-sector-fold.png' });
  console.log('✓ 桌面板块详情: /tmp/p1b-desktop-sector.png');
  
  // 2. 桌面端个股详情页
  const stockCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const stockPage = await stockCtx.newPage();
  await stockPage.goto(`${BASE}/stocks/300308`, { waitUntil: 'networkidle', timeout: 30000 });
  await stockPage.waitForTimeout(3000);
  await stockPage.screenshot({ path: '/tmp/p1b-desktop-stock.png', fullPage: true });
  await stockPage.screenshot({ path: '/tmp/p1b-desktop-stock-fold.png' });
  console.log('✓ 桌面个股详情: /tmp/p1b-desktop-stock.png');
  
  // 3. 交易面板（点击买入按钮）
  const buyBtn = await stockPage.locator('button:has-text("买入")').first();
  if (await buyBtn.isVisible()) {
    await buyBtn.click();
    await stockPage.waitForTimeout(1000);
    await stockPage.screenshot({ path: '/tmp/p1b-trade-panel.png' });
    console.log('✓ 交易面板: /tmp/p1b-trade-panel.png');
  }
  
  // 4. 手机端板块详情页
  const mobSectorCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const mobSectorPage = await mobSectorCtx.newPage();
  await mobSectorPage.goto(`${BASE}/mobile/sectors/optical-communication`, { waitUntil: 'networkidle', timeout: 30000 });
  await mobSectorPage.waitForTimeout(2000);
  await mobSectorPage.screenshot({ path: '/tmp/p1b-mobile-sector.png', fullPage: true });
  await mobSectorPage.screenshot({ path: '/tmp/p1b-mobile-sector-fold.png' });
  console.log('✓ 手机板块详情: /tmp/p1b-mobile-sector.png');
  
  // 5. 手机端交易确认页
  const mobTradeCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const mobTradePage = await mobTradeCtx.newPage();
  await mobTradePage.goto(`${BASE}/mobile/trade/300308`, { waitUntil: 'networkidle', timeout: 30000 });
  await mobTradePage.waitForTimeout(2000);
  await mobTradePage.screenshot({ path: '/tmp/p1b-mobile-trade.png', fullPage: true });
  await mobTradePage.screenshot({ path: '/tmp/p1b-mobile-trade-fold.png' });
  console.log('✓ 手机交易确认: /tmp/p1b-mobile-trade.png');
  
  // 6. 桌面首页（Final Cleanup后）
  const homeCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const homePage = await homeCtx.newPage();
  await homePage.goto(`${BASE}`, { waitUntil: 'networkidle', timeout: 30000 });
  await homePage.waitForTimeout(2000);
  await homePage.screenshot({ path: '/tmp/p1b-desktop-home.png' });
  console.log('✓ 桌面首页: /tmp/p1b-desktop-home.png');
  
  // 7. 手机首页（Final Cleanup后）
  const mobHomeCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const mobHomePage = await mobHomeCtx.newPage();
  await mobHomePage.goto(`${BASE}/mobile`, { waitUntil: 'networkidle', timeout: 30000 });
  await mobHomePage.waitForTimeout(2000);
  await mobHomePage.screenshot({ path: '/tmp/p1b-mobile-home.png' });
  console.log('✓ 手机首页: /tmp/p1b-mobile-home.png');
  
  await browser.close();
  console.log('\n=== 截图完成 ===');
})();
