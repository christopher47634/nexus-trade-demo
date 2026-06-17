const { chromium } = require('playwright');
const fs = require('fs');
const out = '/tmp/p2b1-extra';

(async () => {
  const browser = await chromium.launch({
    headless: true, executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  // CSS mode - full page with cards visible
  await p.goto('http://localhost:3458/visual-lab', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);

  // Take full page screenshot for CSS mode
  await p.screenshot({ path: out + '/css-full.png', fullPage: true });
  console.log('css full page');

  // Switch to Canvas
  const canvasBtn = await p.locator('button:has-text("Canvas")').first();
  if (await canvasBtn.isVisible()) {
    await canvasBtn.click();
    await p.waitForTimeout(3000);
    await p.screenshot({ path: out + '/canvas-full.png', fullPage: true });
    console.log('canvas full page');
  }

  // Hover on first card
  const firstCard = await p.locator('.group').first();
  if (await firstCard.isVisible()) {
    await firstCard.hover();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: out + '/hover-first-card.png' });
    console.log('hover state');
  }

  // Animations off
  const animBtn = await p.locator('button:has-text("动画")').first();
  if (await animBtn.isVisible()) {
    await animBtn.click();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: out + '/animations-off.png', fullPage: true });
    console.log('animations off');
  }

  await browser.close();
  console.log('done');
})();
