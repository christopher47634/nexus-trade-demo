const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await ctx.newPage();
  const outDir = '/tmp/kline-verify';

  // Navigate to stock detail page
  await page.goto('http://localhost:3458/stocks/300308', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);

  // 1. 日K (default selected)
  await page.screenshot({ path: `${outDir}/01-daily-kline.png`, fullPage: false });
  console.log('01 daily kline captured');

  // 2. 周K
  const weekBtn = page.locator('button:has-text("周K")');
  await weekBtn.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${outDir}/02-weekly-kline.png`, fullPage: false });
  console.log('02 weekly kline captured');

  // 3. 月K
  const monthBtn = page.locator('button:has-text("月K")');
  await monthBtn.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${outDir}/03-monthly-kline.png`, fullPage: false });
  console.log('03 monthly kline captured');

  // 4. 分时
  const timeBtn = page.locator('button:has-text("分时")');
  await timeBtn.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${outDir}/04-intraday.png`, fullPage: false });
  console.log('04 intraday captured');

  // 5. Back to 日K, scroll to show volume
  const dayBtn = page.locator('button:has-text("日K")');
  await dayBtn.click();
  await page.waitForTimeout(3000);
  // Full page to show volume below
  await page.screenshot({ path: `${outDir}/05-daily-with-volume.png`, fullPage: true });
  console.log('05 daily with volume captured');

  await browser.close();
  console.log('\n=== All K-line verification screenshots done ===');
})();
