const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Desktop 1440
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const dp = await desktopCtx.newPage();
  
  // 1. /visual-test 10个板块卡片
  await dp.goto('http://localhost:3458/visual-test', { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(3000);
  await dp.screenshot({ path: '/tmp/p1e-visual-test.png', fullPage: false });
  console.log('✓ 1. /visual-test 10个板块');
  
  // 2. desktop home
  await dp.goto('http://localhost:3458', { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(3000);
  await dp.screenshot({ path: '/tmp/p1e-desktop-home.png', fullPage: false });
  console.log('✓ 2. desktop home');
  
  // 3. desktop sector hero
  await dp.goto('http://localhost:3458/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(3000);
  await dp.screenshot({ path: '/tmp/p1e-desktop-sector-hero.png', fullPage: false });
  console.log('✓ 3. desktop sector hero');
  
  // Mobile
  const mobileCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
  });
  const mp = await mobileCtx.newPage();
  
  // 4. mobile home
  await mp.goto('http://localhost:3458/mobile', { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: '/tmp/p1e-mobile-home.png', fullPage: false });
  console.log('✓ 4. mobile home');
  
  // 5. mobile sector hero
  await mp.goto('http://localhost:3458/mobile/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: '/tmp/p1e-mobile-sector-hero.png', fullPage: false });
  console.log('✓ 5. mobile sector hero');
  
  await browser.close();
  console.log('\n=== P1-E 截图完成 ===');
})();
