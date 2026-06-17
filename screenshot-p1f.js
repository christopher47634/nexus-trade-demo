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
  
  // 1. /visual-test 小卡片区
  await dp.goto('http://localhost:3458/visual-test', { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(3000);
  await dp.screenshot({ path: '/tmp/p1f-visual-test-cards.png', fullPage: false });
  console.log('✓ 1. /visual-test 小卡片');
  
  // 2. /visual-test Hero区（滚动到下方）
  await dp.evaluate(() => window.scrollTo(0, 1200));
  await dp.waitForTimeout(500);
  await dp.screenshot({ path: '/tmp/p1f-visual-test-hero1.png', fullPage: false });
  console.log('✓ 2. /visual-test Hero区1');
  
  await dp.evaluate(() => window.scrollTo(0, 2400));
  await dp.waitForTimeout(500);
  await dp.screenshot({ path: '/tmp/p1f-visual-test-hero2.png', fullPage: false });
  console.log('✓ 3. /visual-test Hero区2');
  
  // 3. desktop home
  await dp.goto('http://localhost:3458', { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(3000);
  await dp.screenshot({ path: '/tmp/p1f-desktop-home.png', fullPage: false });
  console.log('✓ 4. desktop home');
  
  // 4. desktop sector hero - optical
  await dp.goto('http://localhost:3458/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(3000);
  await dp.screenshot({ path: '/tmp/p1f-desktop-hero-optical.png', fullPage: false });
  console.log('✓ 5. desktop hero optical');
  
  // 5. desktop sector hero - compute
  await dp.goto('http://localhost:3458/sectors/compute', { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(2000);
  await dp.screenshot({ path: '/tmp/p1f-desktop-hero-compute.png', fullPage: false });
  console.log('✓ 6. desktop hero compute');
  
  // 6. desktop sector hero - semiconductor
  await dp.goto('http://localhost:3458/sectors/semiconductor', { waitUntil: 'networkidle', timeout: 30000 });
  await dp.waitForTimeout(2000);
  await dp.screenshot({ path: '/tmp/p1f-desktop-hero-semiconductor.png', fullPage: false });
  console.log('✓ 7. desktop hero semiconductor');
  
  // Mobile
  const mobileCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
  });
  const mp = await mobileCtx.newPage();
  
  // 7. mobile home
  await mp.goto('http://localhost:3458/mobile', { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: '/tmp/p1f-mobile-home.png', fullPage: false });
  console.log('✓ 8. mobile home');
  
  // 8. mobile sector hero - optical
  await mp.goto('http://localhost:3458/mobile/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 30000 });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: '/tmp/p1f-mobile-hero-optical.png', fullPage: false });
  console.log('✓ 9. mobile hero optical');
  
  await browser.close();
  console.log('\n=== P1-F 截图完成 ===');
})();
