import { chromium } from 'playwright';

const BASE = 'https://stock-trading-demo.vercel.app';
const SCREENSHOT_DIR = '/home/chris47634/stock-trading-demo/final-delivery/p4-b-release';

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu']
});

const results = [];

// Mobile checks
for (const width of [390, 360, 320]) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  const screenshot = `${SCREENSHOT_DIR}/mobile-${width}.png`;
  await page.screenshot({ path: screenshot, fullPage: false });

  results.push({
    check: `Mobile ${width}px`,
    passed: !overflow.overflow,
    scrollWidth: overflow.scrollWidth,
    clientWidth: overflow.clientWidth,
    screenshot
  });

  await context.close();
}

// Desktop check
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  // Check sector cards visible
  const sectorCards = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="sector"], [class*="card"], [class*="grid"] > div');
    return cards.length;
  });

  const screenshot = `${SCREENSHOT_DIR}/desktop-1440.png`;
  await page.screenshot({ path: screenshot, fullPage: false });

  results.push({
    check: 'Desktop 1440px',
    passed: !overflow.overflow,
    scrollWidth: overflow.scrollWidth,
    clientWidth: overflow.clientWidth,
    sectorCards,
    screenshot
  });

  await context.close();
}

await browser.close();

console.log(JSON.stringify(results, null, 2));
