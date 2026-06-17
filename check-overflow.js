const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'zh-CN' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3458', { waitUntil: 'networkidle', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  // Find elements wider than viewport
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflowEls = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > vw + 5) {
        overflowEls.push({
          tag: el.tagName,
          class: el.className?.toString().substring(0, 80),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        });
      }
    });
    return { vw, docWidth: document.documentElement.scrollWidth, elements: overflowEls.slice(0, 15) };
  });
  console.log(JSON.stringify(overflow, null, 2));
  
  // Also check the order detail row
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const p2 = await ctx2.newPage();
  await p2.goto('http://localhost:3458/orders', { waitUntil: 'networkidle', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const orderContent = await p2.textContent('body');
  console.log('\n--- Orders page content snippet ---');
  // Look for commission
  if (orderContent.includes('佣金')) {
    console.log('佣金 found in page');
    const idx = orderContent.indexOf('佣金');
    console.log('Context:', orderContent.substring(Math.max(0, idx - 50), idx + 50));
  } else {
    console.log('佣金 NOT found on orders page');
  }
  
  // Check if order detail needs expanding
  const expandBtn = await p2.$('text=详情, text=展开, [class*="expand"]');
  console.log('Expand button:', !!expandBtn);
  
  // Try clicking on the order row
  const orderRow = await p2.$('tr, [class*="order"]');
  if (orderRow) {
    await orderRow.click();
    await new Promise(r => setTimeout(r, 1000));
    const afterClick = await p2.textContent('body');
    console.log('After click, has 佣金:', afterClick.includes('佣金'));
  }
  
  await browser.close();
}
run();
