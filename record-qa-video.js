const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: '/tmp/p4a-video', size: { width: 1440, height: 900 } }
  });
  const page = await context.newPage();

  // 1. Homepage (3s)
  console.log('1. Homepage...');
  await page.goto('http://localhost:3458', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 2. Click optical-communication sector (3s)
  console.log('2. Sector click...');
  await page.locator('a[href*="optical-communication"], a[href*="sectors"]').first().click({ timeout: 5000 }).catch(() => {
    // fallback: click the text
    return page.locator('text=光通信').first().click();
  });
  await page.waitForTimeout(3000);

  // 3. Sector detail page (3s)
  console.log('3. Sector detail...');
  await page.waitForTimeout(2000);

  // 4. Click stock (3s)
  console.log('4. Stock click...');
  await page.locator('a[href*="300308"], a[href*="stocks"]').first().click({ timeout: 5000 }).catch(() => {
    return page.locator('text=中际旭创').first().click();
  });
  await page.waitForTimeout(3000);

  // 5. Stock detail (3s)
  console.log('5. Stock detail...');
  await page.waitForTimeout(2000);

  // 6. Trade panel - click buy button (2s)
  console.log('6. Trade panel...');
  // Use force click to bypass overlay
  await page.locator('text=买入').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(2000);

  // 7. Enter quantity (2s)
  console.log('7. Enter quantity...');
  const inputs = page.locator('input[type="number"]');
  const count = await inputs.count();
  if (count > 0) {
    await inputs.last().fill('1');
  }
  await page.waitForTimeout(2000);

  // 8. Submit (2s)
  console.log('8. Submit...');
  // Find the submit button in trade panel
  const submitBtns = page.locator('button:has-text("买入")');
  const btnCount = await submitBtns.count();
  if (btnCount > 1) {
    await submitBtns.last().click({ force: true }).catch(() => {});
  }
  await page.waitForTimeout(2000);

  // 9. Confirmation dialog (3s)
  console.log('9. Confirmation dialog...');
  await page.waitForTimeout(3000);

  // 10. Confirm (2s)
  console.log('10. Confirm...');
  await page.locator('button:has-text("确认委托")').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(2000);

  // 11. Orders page (3s)
  console.log('11. Orders page...');
  await page.goto('http://localhost:3458/orders', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 12. Final (2s)
  console.log('12. Final...');
  await page.waitForTimeout(2000);

  await context.close();
  await browser.close();

  const fs = require('fs');
  const files = fs.readdirSync('/tmp/p4a-video');
  console.log('Video files:', files);
  console.log('Done!');
})();
