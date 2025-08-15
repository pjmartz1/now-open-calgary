const puppeteer = require('puppeteer');

async function takeScreenshot() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Navigate to localhost:3003
    await page.goto('http://localhost:3003', { waitUntil: 'networkidle2' });
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'homepage-screenshot.png', 
      fullPage: true 
    });
    
    console.log('Screenshot saved as homepage-screenshot.png');
    
    // Also take a mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'homepage-mobile-screenshot.png', 
      fullPage: true 
    });
    
    console.log('Mobile screenshot saved as homepage-mobile-screenshot.png');
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();