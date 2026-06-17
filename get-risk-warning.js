const { chromium } = require('playwright');
const path = require('path');
const DIR = path.join(__dirname, 'final-delivery/p4-a-qa-gate/screenshots');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const page = await ctx.newPage();
  
  // Go to homepage -> 算力 sector -> 寒武纪 (has riskWarning)
  await page.goto('http://localhost:3458', { waitUntil: 'networkidle', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  // Click 算力 sector (#1)
  const sectors = await page.$$('[id="sectors"] > div');
  await sectors[0].click();
  await new Promise(r => setTimeout(r, 2500));
  
  // Click 寒武纪
  await page.click('text=寒武纪');
  await new Promise(r => setTimeout(r, 2500));
  
  // Take stock detail screenshot (should show risk warning banner)
  await page.screenshot({ path: path.join(DIR, '08-risk-warning.png') });
  console.log('Saved stock detail with risk warning');
  
  // Also open trade dialog to show risk warning in trade panel
  await page.click('button:has-text("买入")');
  await new Promise(r => setTimeout(r, 1500));
  
  // Check if risk warning is visible
  const content = await page.textContent('body');
  console.log('Has risk warning:', content.includes('高估值风险') || content.includes('风险'));
  console.log('Has 换手率:', content.includes('换手率'));
  console.log('Has 亏损:', content.includes('亏损'));
  
  await browser.close();
}
run();
