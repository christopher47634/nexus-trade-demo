const { chromium } = require('playwright');
async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3458/orders', { waitUntil: 'networkidle', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Click on order row to expand
  const rows = await page.$$('[class*="cursor-pointer"]');
  console.log('Clickable rows:', rows.length);
  for (const row of rows) {
    const text = await row.textContent();
    if (text.includes('WT') || text.includes('中际')) {
      console.log('Clicking order row...');
      await row.click();
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }
  
  const expanded = await page.textContent('body');
  console.log('Has 佣金:', expanded.includes('佣金'));
  console.log('Has 已成交:', expanded.includes('已成交'));
  console.log('Has WT:', expanded.includes('WT'));
  
  // Screenshot the expanded view
  await page.screenshot({ path: '/home/chris47634/stock-trading-demo/final-delivery/p4-a-qa-gate/screenshots/07-orders-page.png' });
  console.log('Updated orders screenshot');
  
  await browser.close();
}
run();
