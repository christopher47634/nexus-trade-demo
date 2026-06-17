const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  
  const page = await context.newPage();
  
  // Desktop home - sectors area
  await page.goto('http://localhost:3458', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/sector-desktop-home.png', fullPage: false });
  console.log('✓ 桌面首页（板块区域）');
  
  // Desktop home - full page
  await page.screenshot({ path: '/tmp/sector-desktop-full.png', fullPage: true });
  console.log('✓ 桌面首页全页');
  
  // Mobile
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3458/mobile', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(3000);
  await mobilePage.screenshot({ path: '/tmp/sector-mobile-home.png', fullPage: false });
  console.log('✓ 手机首页（板块区域）');
  
  await browser.close();
  console.log('\n=== 截图完成 ===');
})();
