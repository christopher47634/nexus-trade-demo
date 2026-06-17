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
  const outDir = '/tmp/chart-type-verify';

  // Navigate to stock detail page
  await page.goto('http://localhost:3458/stocks/300308', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);

  // 1. 日K 蜡烛图 (default)
  await page.screenshot({ path: `${outDir}/01-daily-candlestick.png`, fullPage: false });
  console.log('01 daily candlestick');

  // 2. 日K 面积图
  const areaBtn = page.locator('button:has-text("面积")');
  await areaBtn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${outDir}/02-daily-area.png`, fullPage: false });
  console.log('02 daily area');

  // 3. 日K 折线图
  const lineBtn = page.locator('button:has-text("折线")');
  await lineBtn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${outDir}/03-daily-line.png`, fullPage: false });
  console.log('03 daily line');

  // 4. 日K OHLC (bar)
  const ohlcBtn = page.locator('button:has-text("OHLC")');
  await ohlcBtn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${outDir}/04-daily-ohlc.png`, fullPage: false });
  console.log('04 daily ohlc');

  // 5. 成交量关闭
  const volBtn = page.locator('button:has-text("成交量")');
  await volBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/05-volume-off.png`, fullPage: false });
  console.log('05 volume off');

  // 6. 成交量开启
  await volBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/06-volume-on.png`, fullPage: false });
  console.log('06 volume on');

  // 7. 分时 面积图
  const intradayBtn = page.locator('button:has-text("分时")');
  await intradayBtn.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${outDir}/07-intraday-area.png`, fullPage: false });
  console.log('07 intraday area');

  await browser.close();
  console.log('\n=== Chart type verification screenshots done ===');
})();
