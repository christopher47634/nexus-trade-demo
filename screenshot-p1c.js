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
  const desktopPage = await desktopCtx.newPage();
  
  // 1. Desktop home full
  await desktopPage.goto('http://localhost:3458', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(3000);
  await desktopPage.screenshot({ path: '/tmp/p1c-desktop-home-full.png', fullPage: true });
  console.log('✓ 1. desktop home full');
  
  // 2. Desktop home close-up of sectors (scroll to sectors area)
  await desktopPage.evaluate(() => {
    const el = document.querySelector('[id="sectors"]') || document.querySelector('h2');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: '/tmp/p1c-desktop-sectors-closeup.png', fullPage: false });
  console.log('✓ 2. desktop sectors close-up');
  
  // 3. Desktop sector detail hero
  await desktopPage.goto('http://localhost:3458/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 30000 });
  await desktopPage.waitForTimeout(3000);
  await desktopPage.screenshot({ path: '/tmp/p1c-desktop-sector-hero.png', fullPage: false });
  console.log('✓ 3. desktop sector detail hero');
  
  // Mobile
  const mobileCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
  });
  const mobilePage = await mobileCtx.newPage();
  
  // 4. Mobile home sector cards
  await mobilePage.goto('http://localhost:3458/mobile', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(3000);
  await mobilePage.screenshot({ path: '/tmp/p1c-mobile-home.png', fullPage: false });
  console.log('✓ 4. mobile home sector cards');
  
  // 5. Mobile sector detail hero
  await mobilePage.goto('http://localhost:3458/mobile/sectors/optical-communication', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(3000);
  await mobilePage.screenshot({ path: '/tmp/p1c-mobile-sector-hero.png', fullPage: false });
  console.log('✓ 5. mobile sector detail hero');
  
  await browser.close();
  console.log('\n=== P1-C 截图完成 ===');
})();
