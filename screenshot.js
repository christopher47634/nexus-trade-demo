const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // 桌面端截图
  console.log('=== 桌面端首页截图 ===');
  
  // 1440px 宽度
  const desktopContext1440 = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const desktopPage1440 = await desktopContext1440.newPage();
  await desktopPage1440.goto('http://localhost:3457', { waitUntil: 'networkidle' });
  await desktopPage1440.waitForTimeout(2000); // 等待动画完成
  await desktopPage1440.screenshot({ path: '/tmp/desktop-1440-full.png', fullPage: true });
  await desktopPage1440.screenshot({ path: '/tmp/desktop-1440-fold.png' });
  console.log('✓ 1440px 全页截图: /tmp/desktop-1440-full.png');
  console.log('✓ 1440px 首屏截图: /tmp/desktop-1440-fold.png');
  
  // 1920px 宽度
  const desktopContext1920 = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const desktopPage1920 = await desktopContext1920.newPage();
  await desktopPage1920.goto('http://localhost:3457', { waitUntil: 'networkidle' });
  await desktopPage1920.waitForTimeout(2000);
  await desktopPage1920.screenshot({ path: '/tmp/desktop-1920-full.png', fullPage: true });
  await desktopPage1920.screenshot({ path: '/tmp/desktop-1920-fold.png' });
  console.log('✓ 1920px 全页截图: /tmp/desktop-1920-full.png');
  console.log('✓ 1920px 首屏截图: /tmp/desktop-1920-fold.png');
  
  // 手机端截图
  console.log('\n=== 手机端首页截图 ===');
  
  // iPhone 14/15 Pro (393x852)
  const iphoneContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const iphonePage = await iphoneContext.newPage();
  await iphonePage.goto('http://localhost:3457/mobile', { waitUntil: 'networkidle' });
  await iphonePage.waitForTimeout(2000);
  await iphonePage.screenshot({ path: '/tmp/mobile-iphone-full.png', fullPage: true });
  await iphonePage.screenshot({ path: '/tmp/mobile-iphone-fold.png' });
  console.log('✓ iPhone 全页截图: /tmp/mobile-iphone-full.png');
  console.log('✓ iPhone 首屏截图: /tmp/mobile-iphone-fold.png');
  
  // Android 常见尺寸 (360x800)
  const androidContext = await browser.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const androidPage = await androidContext.newPage();
  await androidPage.goto('http://localhost:3457/mobile', { waitUntil: 'networkidle' });
  await androidPage.waitForTimeout(2000);
  await androidPage.screenshot({ path: '/tmp/mobile-android-full.png', fullPage: true });
  await androidPage.screenshot({ path: '/tmp/mobile-android-fold.png' });
  console.log('✓ Android 全页截图: /tmp/mobile-android-full.png');
  console.log('✓ Android 首屏截图: /tmp/mobile-android-fold.png');
  
  // 交互状态截图
  console.log('\n=== 交互状态截图 ===');
  
  // 板块卡片 hover 状态
  const hoverContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const hoverPage = await hoverContext.newPage();
  await hoverPage.goto('http://localhost:3457', { waitUntil: 'networkidle' });
  await hoverPage.waitForTimeout(2000);
  
  // 找到第一个板块卡片并hover
  const sectorCard = await hoverPage.locator('[class*="group relative overflow-hidden rounded-2xl"]').first();
  if (await sectorCard.isVisible()) {
    await sectorCard.hover();
    await hoverPage.waitForTimeout(500);
    await hoverPage.screenshot({ path: '/tmp/interaction-hover.png' });
    console.log('✓ 板块卡片 hover 状态: /tmp/interaction-hover.png');
  }
  
  // MetricCard 数字显示
  const metricCard = await hoverPage.locator('[class*="glass p-4 flex flex-col gap-1.5"]').first();
  if (await metricCard.isVisible()) {
    await metricCard.scrollIntoViewIfNeeded();
    await hoverPage.waitForTimeout(500);
    await hoverPage.screenshot({ path: '/tmp/interaction-metric.png' });
    console.log('✓ MetricCard 数字显示: /tmp/interaction-metric.png');
  }
  
  // ThemeSwitcher 展开状态
  const themeSwitcher = await hoverPage.locator('button:has(svg.lucide-palette)').first();
  if (await themeSwitcher.isVisible()) {
    await themeSwitcher.click();
    await hoverPage.waitForTimeout(500);
    await hoverPage.screenshot({ path: '/tmp/interaction-theme.png' });
    console.log('✓ ThemeSwitcher 展开状态: /tmp/interaction-theme.png');
  }
  
  // 手机端热门板块横滑区域
  const mobileScrollContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const mobileScrollPage = await mobileScrollContext.newPage();
  await mobileScrollPage.goto('http://localhost:3457/mobile', { waitUntil: 'networkidle' });
  await mobileScrollPage.waitForTimeout(2000);
  
  // 滚动到热门板块区域
  await mobileScrollPage.evaluate(() => {
    const sectorsSection = document.querySelector('[class*="flex gap-3 overflow-x-auto"]');
    if (sectorsSection) {
      sectorsSection.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await mobileScrollPage.waitForTimeout(500);
  await mobileScrollPage.screenshot({ path: '/tmp/mobile-sectors-scroll.png' });
  console.log('✓ 手机端热门板块横滑: /tmp/mobile-sectors-scroll.png');
  
  await browser.close();
  console.log('\n=== 所有截图完成 ===');
})();
