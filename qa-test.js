const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'final-delivery/p4-a-qa-gate/screenshots');
const BASE_URL = 'http://localhost:3458';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'zh-CN',
  });
  const page = await context.newPage();
  
  const results = {
    homepage: {},
    sectorDetail: {},
    stockDetail: {},
    tradePanel: {},
    tradeConfirm: {},
    ordersPage: {},
    mobileHomepage: {},
  };

  try {
    // ==========================================
    // PART A1: Homepage Desktop Screenshots
    // ==========================================
    console.log('=== Navigating to homepage ===');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000); // Wait for animations
    
    // Check for glass cards
    const glassCards = await page.$$('.glass');
    console.log(`Glass cards found: ${glassCards.length}`);
    results.homepage.glassCards = glassCards.length;

    // Check for sector cards
    const sectorCards = await page.$$('[id="sectors"] > div');
    console.log(`Sector cards found: ${sectorCards.length}`);
    results.homepage.sectorCards = sectorCards.length;

    // Check for sector icons (SVG inside sector cards)
    const sectorSvgs = await page.$$('[id="sectors"] > div svg');
    console.log(`Sector SVG icons: ${sectorSvgs.length}`);
    results.homepage.sectorIcons = sectorSvgs.length;

    // Check for Canvas elements (HoverGlow)
    const canvasElements = await page.$$('canvas');
    console.log(`Canvas elements (HoverGlow): ${canvasElements.length}`);
    results.homepage.canvasElements = canvasElements.length;

    // Check for micro chip labels
    const microChips = await page.$$eval('[class*="text-\\[10px\\]"], [class*="text-xs"]', els => els.length);
    console.log(`Small text elements: ${microChips}`);
    results.homepage.microChips = microChips;

    // Take desktop screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-homepage-desktop.png'), fullPage: false });
    console.log('Saved: 01-homepage-desktop.png');

    // ==========================================
    // PART B: Trading Flow Test
    // ==========================================
    
    // Step 2: Click on optical-communication sector card
    console.log('\n=== Looking for optical-communication sector card ===');
    
    // Find sector cards and look for optical communication (光通信 or 光模块)
    const sectorTexts = await page.$$eval('[id="sectors"] > div', divs => 
      divs.map(d => d.textContent?.trim().substring(0, 100))
    );
    console.log('Sector card texts:', sectorTexts.map(t => t?.substring(0, 40)));
    
    // Find and click the optical communication sector
    // It's likely the first sector card (AI chip) or we look for specific text
    const opticalCard = await page.$('[id="sectors"] > div:first-child');
    if (opticalCard) {
      console.log('Clicking first sector card (AI/光通信)...');
      await opticalCard.click();
      await delay(2000);
      
      // Take sector detail screenshot
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-sector-detail.png'), fullPage: false });
      console.log('Saved: 03-sector-detail.png');
      
      // Check for sector detail elements
      const riskBadge = await page.$('[class*="risk"], [class*="badge"]');
      const analysisText = await page.$('[class*="analysis"], p');
      const chartTitle = await page.textContent('body');
      const hasTrend = chartTitle?.includes('板块趋势') || chartTitle?.includes('趋势');
      results.sectorDetail.hasRiskBadge = !!riskBadge;
      results.sectorDetail.hasAnalysisText = !!analysisText;
      results.sectorDetail.hasTrendChart = hasTrend;
      console.log(`Sector detail - Risk badge: ${!!riskBadge}, Analysis: ${!!analysisText}, Trend chart: ${hasTrend}`);
      
      // Check page content for sector detail indicators
      const pageContent = await page.textContent('body');
      const hasSectorRisk = pageContent?.includes('风险') || pageContent?.includes('risk');
      const hasSectorAnalysis = pageContent?.includes('分析') || pageContent?.includes('研判');
      results.sectorDetail.hasRiskText = hasSectorRisk;
      results.sectorDetail.hasAnalysisContent = hasSectorAnalysis;
      console.log(`Sector detail - Risk text: ${hasSectorRisk}, Analysis content: ${hasSectorAnalysis}`);
    }

    // Step 4: Click on stock (中际旭创 300308)
    console.log('\n=== Looking for stock 中际旭创 ===');
    // Look for the stock in the page
    const stockLink = await page.$('text=中际旭创');
    if (stockLink) {
      await stockLink.click();
      await delay(2000);
      
      // Take stock detail screenshot
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-stock-detail.png'), fullPage: false });
      console.log('Saved: 04-stock-detail.png');
      
      // Check for stock detail elements
      const stockContent = await page.textContent('body');
      results.stockDetail.hasRiskWarning = stockContent?.includes('风险提示') || stockContent?.includes('风险警告') || stockContent?.includes('谨慎');
      results.stockDetail.hasMA = stockContent?.includes('MA5') || stockContent?.includes('MA10') || stockContent?.includes('MA20');
      results.stockDetail.hasAnalysis = stockContent?.includes('分析') || stockContent?.includes('研判');
      results.stockDetail.hasTradePanel = stockContent?.includes('买入') || stockContent?.includes('卖出');
      console.log(`Stock detail - Risk warning: ${results.stockDetail.hasRiskWarning}, MA: ${results.stockDetail.hasMA}, Analysis: ${results.stockDetail.hasAnalysis}, Trade panel: ${results.stockDetail.hasTradePanel}`);
      
      // Step 6: Interact with trade panel
      console.log('\n=== Trade Panel Interaction ===');
      
      // Find quantity input
      const qtyInput = await page.$('input[type="number"], input[placeholder*="数量"], input[placeholder*="手"]');
      if (qtyInput) {
        await qtyInput.fill('100');
        console.log('Entered quantity: 100');
        await delay(500);
      } else {
        console.log('No quantity input found, looking for alternative...');
        // Try to find any input
        const inputs = await page.$$('input');
        console.log(`Found ${inputs.length} input elements`);
        for (const input of inputs) {
          const placeholder = await input.getAttribute('placeholder');
          const type = await input.getAttribute('type');
          console.log(`  Input: type=${type}, placeholder=${placeholder}`);
        }
      }
      
      // Take trade panel screenshot
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-trade-panel.png'), fullPage: false });
      console.log('Saved: 05-trade-panel.png');
      
      // Check for commission and disclaimer
      const hasCommission = stockContent?.includes('佣金') || stockContent?.includes('手续费') || stockContent?.includes('费用');
      const hasDisclaimer = stockContent?.includes('模拟交易') || stockContent?.includes('不构成投资建议');
      results.tradePanel.hasCommission = hasCommission;
      results.tradePanel.hasDisclaimer = hasDisclaimer;
      console.log(`Trade panel - Commission: ${hasCommission}, Disclaimer: ${hasDisclaimer}`);
      
      // Step 7: Click buy button
      const buyBtn = await page.$('button:has-text("买入"), button:has-text("买"), button:has-text("确认")');
      if (buyBtn) {
        await buyBtn.click();
        await delay(1500);
        
        // Take confirmation dialog screenshot
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-trade-confirm.png'), fullPage: false });
        console.log('Saved: 06-trade-confirm.png');
        
        const confirmContent = await page.textContent('body');
        results.tradeConfirm.hasStockName = confirmContent?.includes('中际旭创') || confirmContent?.includes('300308');
        results.tradeConfirm.hasPrice = confirmContent?.includes('价格') || confirmContent?.includes('¥');
        results.tradeConfirm.hasQuantity = confirmContent?.includes('100') || confirmContent?.includes('数量');
        results.tradeConfirm.hasCommission = confirmContent?.includes('佣金') || confirmContent?.includes('手续费') || confirmContent?.includes('费用');
        results.tradeConfirm.hasConfirmBtn = confirmContent?.includes('确认委托');
        results.tradeConfirm.hasCancelBtn = confirmContent?.includes('取消');
        console.log(`Trade confirm - Stock: ${results.tradeConfirm.hasStockName}, Price: ${results.tradeConfirm.hasPrice}, Qty: ${results.tradeConfirm.hasQuantity}, Commission: ${results.tradeConfirm.hasCommission}`);
        console.log(`Trade confirm - Confirm btn: ${results.tradeConfirm.hasConfirmBtn}, Cancel btn: ${results.tradeConfirm.hasCancelBtn}`);
        
        // Step 8: Click confirm
        const confirmBtn = await page.$('button:has-text("确认委托")');
        if (confirmBtn) {
          await confirmBtn.click();
          await delay(1500);
          console.log('Clicked 确认委托');
        }
      } else {
        console.log('Buy button not found');
      }
    } else {
      console.log('Stock 中际旭创 not found on page, trying alternate approach...');
      // Go back and try different approach
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await delay(2000);
      
      // Try clicking on sector cards to find a stock page
      const cards = await page.$$('[id="sectors"] > div');
      if (cards.length > 0) {
        await cards[0].click();
        await delay(2000);
        
        // Now look for stocks
        const allText = await page.textContent('body');
        console.log('Page contains 中际旭创:', allText?.includes('中际旭创'));
        
        // Find clickable stock items
        const stockItems = await page.$$('text=中际旭创');
        console.log(`Found ${stockItems.length} elements with 中际旭创`);
        
        if (stockItems.length > 0) {
          await stockItems[0].click();
          await delay(2000);
          await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-stock-detail.png'), fullPage: false });
          console.log('Saved: 04-stock-detail.png (retry)');
        }
      }
    }

    // Step 9: Navigate to orders page
    console.log('\n=== Orders Page ===');
    await page.goto(`${BASE_URL}/orders`, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-orders-page.png'), fullPage: false });
    console.log('Saved: 07-orders-page.png');
    
    const ordersContent = await page.textContent('body');
    results.ordersPage.hasOrderId = ordersContent?.includes('WT') || ordersContent?.includes('委托');
    results.ordersPage.hasCommission = ordersContent?.includes('佣金') || ordersContent?.includes('手续费');
    results.ordersPage.hasStatus = ordersContent?.includes('已委托') || ordersContent?.includes('已成交') || ordersContent?.includes('待成交') || ordersContent?.includes('状态');
    console.log(`Orders - Order ID (WT format): ${results.ordersPage.hasOrderId}, Commission: ${results.ordersPage.hasCommission}, Status: ${results.ordersPage.hasStatus}`);
    
    // ==========================================
    // PART A3: Mobile Layout
    // ==========================================
    console.log('\n=== Mobile Layout Test ===');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      locale: 'zh-CN',
    });
    const mobilePage = await mobileContext.newPage();
    
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(3000);
    
    // Check for horizontal overflow
    const hasOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    results.mobileHomepage.hasOverflow = hasOverflow;
    console.log(`Mobile - Horizontal overflow: ${hasOverflow}`);
    
    await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '02-homepage-mobile.png'), fullPage: false });
    console.log('Saved: 02-homepage-mobile.png');
    
    // Check risk warning - navigate to stock detail on mobile
    console.log('\n=== Risk Warning Screenshot ===');
    // Navigate through the flow on desktop to get risk warning
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await delay(2000);
    
    // Click first sector
    const firstSector = await page.$('[id="sectors"] > div:first-child');
    if (firstSector) {
      await firstSector.click();
      await delay(2000);
      
      // Look for a high-risk stock or click first stock
      const stocks = await page.$$('text=/中际旭创|长光华芯|仕佳光子|源杰科技/');
      if (stocks.length > 0) {
        await stocks[0].click();
        await delay(2000);
      }
    }
    
    // Scroll down to find risk warning
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-risk-warning.png'), fullPage: true });
    console.log('Saved: 08-risk-warning.png');
    
    await mobileContext.close();
    
  } catch (error) {
    console.error('Error during test:', error.message);
  }
  
  await browser.close();
  
  // Print summary
  console.log('\n=== TEST RESULTS SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);
