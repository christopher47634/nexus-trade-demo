const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'final-delivery/p4-a-qa-gate/screenshots');
const BASE_URL = 'http://localhost:3458';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'zh-CN' });
  const page = await context.newPage();
  const results = {};

  try {
    // ===== PART B: Trading Flow Test =====
    
    // 1. Navigate to homepage
    console.log('1. Navigate to homepage');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    // 2. Click on optical-communication sector card (光通信, #2)
    console.log('2. Click on optical-communication sector (#2 光通信)');
    const sectors = await page.$$('[id="sectors"] > div');
    console.log(`   Found ${sectors.length} sector cards`);
    
    // Click second card (光通信)
    if (sectors.length >= 2) {
      await sectors[1].click();
      await delay(2500);
    }
    
    // 3. Verify sector detail page
    console.log('3. Verify sector detail page');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-sector-detail.png'), fullPage: false });
    
    const sectorContent = await page.textContent('body');
    results.sectorDetail = {
      isOptical: sectorContent.includes('光通信') || sectorContent.includes('光模块'),
      hasRiskBadge: sectorContent.includes('风险'),
      hasAnalysisText: sectorContent.includes('分析') || sectorContent.includes('趋势'),
      hasTrendChart: sectorContent.includes('板块趋势'),
    };
    console.log(`   光通信: ${results.sectorDetail.isOptical}, Risk: ${results.sectorDetail.hasRiskBadge}, Analysis: ${results.sectorDetail.hasAnalysisText}, Trend: ${results.sectorDetail.hasTrendChart}`);
    
    // Check for risk level badge specifically
    const riskBadge = await page.$('[class*="risk"], [class*="badge"]');
    const riskBadgeText = await page.$$eval('*', els => {
      for (const el of els) {
        const text = el.textContent.trim();
        if (text.includes('风险') && text.length < 20) return text;
      }
      return null;
    });
    console.log(`   Risk badge element: ${riskBadgeText}`);
    
    // 4. Click on 中际旭创 (300308)
    console.log('4. Click on 中际旭创 (300308)');
    const stockLink = await page.$('text=中际旭创');
    if (stockLink) {
      await stockLink.click();
      await delay(2500);
    } else {
      console.log('   中际旭创 not found, looking for other clickable stocks...');
      // Try clicking any stock row
      const stockRows = await page.$$('tr[class*="cursor"], div[class*="cursor"]:has-text("300308")');
      console.log(`   Found ${stockRows.length} clickable stock rows`);
      if (stockRows.length > 0) {
        await stockRows[0].click();
        await delay(2500);
      }
    }
    
    // 5. Verify stock detail page
    console.log('5. Verify stock detail page');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-stock-detail.png'), fullPage: false });
    
    const stockContent = await page.textContent('body');
    results.stockDetail = {
      hasStockName: stockContent.includes('中际旭创') || stockContent.includes('300308'),
      hasRiskWarning: stockContent.includes('风险提示') || stockContent.includes('风险警告') || stockContent.includes('谨慎') || stockContent.includes('风险'),
      hasMA5: stockContent.includes('MA5'),
      hasMA10: stockContent.includes('MA10'),
      hasMA20: stockContent.includes('MA20'),
      hasAnalysis: stockContent.includes('分析') || stockContent.includes('研判'),
      hasTradePanel: stockContent.includes('买入') || stockContent.includes('卖出'),
    };
    console.log(`   Stock name: ${results.stockDetail.hasStockName}, Risk: ${results.stockDetail.hasRiskWarning}`);
    console.log(`   MA5: ${results.stockDetail.hasMA5}, MA10: ${results.stockDetail.hasMA10}, MA20: ${results.stockDetail.hasMA20}`);
    console.log(`   Analysis: ${results.stockDetail.hasAnalysis}, Trade panel: ${results.stockDetail.hasTradePanel}`);
    
    // Check risk warning banner
    const warningBanner = await page.$('[class*="warning"], [class*="Warning"], [class*="risk-warning"]');
    results.stockDetail.warningBannerElement = !!warningBanner;
    console.log(`   Warning banner element: ${!!warningBanner}`);
    
    // 6. Trade panel interaction
    console.log('6. Trade panel interaction');
    
    // Find and fill quantity input
    const qtyInput = await page.$('input[type="number"]');
    if (qtyInput) {
      await qtyInput.click();
      await qtyInput.fill('100');
      await delay(500);
      console.log('   Entered quantity: 100');
    } else {
      const allInputs = await page.$$('input');
      console.log(`   Found ${allInputs.length} inputs`);
      for (let i = 0; i < allInputs.length; i++) {
        const attrs = await allInputs[i].evaluate(el => ({
          type: el.type, placeholder: el.placeholder, name: el.name
        }));
        console.log(`   Input ${i}:`, attrs);
      }
    }
    
    // Check for commission and disclaimer
    results.tradePanel = {
      hasCommission: stockContent.includes('佣金') || stockContent.includes('手续费') || stockContent.includes('费用'),
      hasDisclaimer: stockContent.includes('模拟交易') || stockContent.includes('不构成投资建议'),
    };
    console.log(`   Commission: ${results.tradePanel.hasCommission}, Disclaimer: ${results.tradePanel.hasDisclaimer}`);
    
    // Scroll to trade panel for screenshot
    await page.evaluate(() => {
      const panel = document.querySelector('[class*="trade"], [class*="Trade"]');
      if (panel) panel.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await delay(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-trade-panel.png'), fullPage: false });
    
    // 7. Click buy button
    console.log('7. Click buy button');
    const buyBtn = await page.$('button:has-text("买入")');
    if (buyBtn) {
      await buyBtn.click();
      await delay(2000);
      
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-trade-confirm.png'), fullPage: false });
      
      const confirmContent = await page.textContent('body');
      results.tradeConfirm = {
        hasStockName: confirmContent.includes('中际旭创') || confirmContent.includes('300308'),
        hasPrice: confirmContent.includes('价格') || confirmContent.includes('×') || confirmContent.includes('¥'),
        hasQuantity: confirmContent.includes('100') || confirmContent.includes('数量'),
        hasCommission: confirmContent.includes('佣金') || confirmContent.includes('手续费') || confirmContent.includes('费用'),
        hasNetAmount: confirmContent.includes('净额') || confirmContent.includes('应付') || confirmContent.includes('金额'),
        hasConfirmBtn: confirmContent.includes('确认委托'),
        hasCancelBtn: confirmContent.includes('取消'),
      };
      console.log(`   Confirm dialog - Stock: ${results.tradeConfirm.hasStockName}`);
      console.log(`   Price: ${results.tradeConfirm.hasPrice}, Qty: ${results.tradeConfirm.hasQuantity}`);
      console.log(`   Commission: ${results.tradeConfirm.hasCommission}, Net: ${results.tradeConfirm.hasNetAmount}`);
      console.log(`   Confirm btn: ${results.tradeConfirm.hasConfirmBtn}, Cancel btn: ${results.tradeConfirm.hasCancelBtn}`);
      
      // 8. Click 确认委托
      console.log('8. Click 确认委托');
      const confirmBtn = await page.$('button:has-text("确认委托")');
      if (confirmBtn) {
        await confirmBtn.click();
        await delay(2000);
        console.log('   Order submitted');
      } else {
        console.log('   确认委托 button not found');
      }
    } else {
      console.log('   Buy button not found');
    }
    
    // 9. Navigate to /orders
    console.log('9. Navigate to /orders');
    await page.goto(`${BASE_URL}/orders`, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-orders-page.png'), fullPage: false });
    
    // 10. Verify order
    console.log('10. Verify order');
    const ordersContent = await page.textContent('body');
    results.ordersPage = {
      hasWTFormat: ordersContent.includes('WT'),
      hasCommission: ordersContent.includes('佣金') || ordersContent.includes('手续费') || ordersContent.includes('费用'),
      hasStatus: ordersContent.includes('已委托') || ordersContent.includes('待成交') || ordersContent.includes('已成交') || ordersContent.includes('部分成交'),
    };
    console.log(`   WT format: ${results.ordersPage.hasWTFormat}, Commission: ${results.ordersPage.hasCommission}, Status: ${results.ordersPage.hasStatus}`);
    
    // Take risk warning screenshot (from stock detail)
    console.log('\n=== Risk Warning Screenshot ===');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    // Navigate to sector -> stock to capture risk warning
    const sects = await page.$$('[id="sectors"] > div');
    if (sects.length >= 2) {
      await sects[1].click();
      await delay(2000);
      const stock = await page.$('text=中际旭创');
      if (stock) {
        await stock.click();
        await delay(2000);
        // Scroll to top to capture risk warning
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-risk-warning.png'), fullPage: true });
        console.log('Saved: 08-risk-warning.png');
      }
    }
    
    // ===== PART A3: Mobile Layout =====
    console.log('\n=== Mobile Layout Test ===');
    const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'zh-CN' });
    const mobilePage = await mobileCtx.newPage();
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    const hasOverflow = await mobilePage.evaluate(() => 
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    results.mobile = { hasOverflow };
    console.log(`Mobile overflow: ${hasOverflow}`);
    
    await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '02-homepage-mobile.png'), fullPage: false });
    console.log('Saved: 02-homepage-mobile.png');
    
    await mobileCtx.close();
    
  } catch (error) {
    console.error('ERROR:', error.message);
  }
  
  await browser.close();
  
  console.log('\n=== FINAL RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);
