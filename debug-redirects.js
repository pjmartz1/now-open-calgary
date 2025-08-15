const puppeteer = require('puppeteer');

async function checkRedirects() {
  console.log('🔍 Starting Redirect Analysis for Google Indexing Issues...\n');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Track redirects
  const redirects = [];
  page.on('response', response => {
    const status = response.status();
    if (status >= 300 && status < 400) {
      redirects.push({
        url: response.url(),
        status: status,
        location: response.headers()['location'] || 'No location header'
      });
    }
  });

  const pagesToTest = [
    'http://localhost:3003/',
    'http://localhost:3003/businesses',
    'http://localhost:3003/restaurants',
    'http://localhost:3003/retail',
    'http://localhost:3003/services',
    'http://localhost:3003/robots.txt',
    'http://localhost:3003/sitemap.xml'
  ];

  for (const url of pagesToTest) {
    console.log(`\n📄 Testing: ${url}`);
    
    try {
      const response = await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      
      const status = response.status();
      console.log(`   Status: ${status}`);
      
      if (status >= 200 && status < 300) {
        console.log('   ✅ OK - No redirects');
      } else if (status >= 300 && status < 400) {
        console.log('   🔄 REDIRECT detected');
        console.log(`   Location: ${response.headers()['location'] || 'Unknown'}`);
      } else if (status >= 400) {
        console.log(`   ❌ ERROR - ${status}`);
      }

      // Check for meta redirects
      const metaRefresh = await page.$eval('meta[http-equiv="refresh"]', el => el?.content).catch(() => null);
      if (metaRefresh) {
        console.log(`   🔄 META REFRESH detected: ${metaRefresh}`);
      }

      // Check for JavaScript redirects
      const jsRedirect = await page.evaluate(() => {
        // Check for common redirect patterns
        const scriptTags = Array.from(document.querySelectorAll('script'));
        for (const script of scriptTags) {
          const content = script.textContent || script.innerHTML;
          if (content.includes('window.location') || content.includes('location.href') || content.includes('location.replace')) {
            return content.substring(0, 200) + '...';
          }
        }
        return null;
      });

      if (jsRedirect) {
        console.log(`   ⚠️  JAVASCRIPT REDIRECT detected: ${jsRedirect}`);
      }

    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }

  await browser.close();

  // Summary
  console.log('\n📋 REDIRECT SUMMARY:');
  if (redirects.length === 0) {
    console.log('✅ No HTTP redirects detected');
  } else {
    console.log(`❌ Found ${redirects.length} HTTP redirects:`);
    redirects.forEach((redirect, index) => {
      console.log(`   ${index + 1}. ${redirect.status} redirect from ${redirect.url}`);
      console.log(`      → ${redirect.location}`);
    });
  }

  console.log('\n🔧 GOOGLE INDEXING RECOMMENDATIONS:');
  console.log('1. Check robots.txt is accessible and properly formatted');
  console.log('2. Ensure sitemap.xml is available and lists all pages');
  console.log('3. Verify no unnecessary redirects in production');
  console.log('4. Check for trailing slash consistency');
  console.log('5. Ensure HTTPS redirects are properly configured in production');
  console.log('6. Submit sitemap to Google Search Console');
  console.log('7. Use "URL Inspection" tool in GSC to test specific pages');
}

// Create robots.txt checker
async function checkRobotsTxt() {
  console.log('\n🤖 ROBOTS.TXT ANALYSIS:');
  
  try {
    const response = await fetch('http://localhost:3003/robots.txt');
    if (response.ok) {
      const content = await response.text();
      console.log('✅ robots.txt accessible');
      console.log('Content:');
      console.log(content);
      
      // Check for common issues
      if (content.includes('Disallow: /')) {
        console.log('⚠️  WARNING: Found "Disallow: /" - this blocks all crawling!');
      }
      
      if (content.includes('Sitemap:')) {
        console.log('✅ Sitemap reference found in robots.txt');
      } else {
        console.log('⚠️  RECOMMENDATION: Add sitemap reference to robots.txt');
      }
    } else {
      console.log(`❌ robots.txt not accessible (${response.status})`);
    }
  } catch (error) {
    console.log(`❌ robots.txt check failed: ${error.message}`);
  }
}

// Create sitemap checker
async function checkSitemap() {
  console.log('\n🗺️  SITEMAP ANALYSIS:');
  
  try {
    const response = await fetch('http://localhost:3003/sitemap.xml');
    if (response.ok) {
      const content = await response.text();
      console.log('✅ sitemap.xml accessible');
      
      // Count URLs
      const urlMatches = content.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;
      console.log(`📊 URLs in sitemap: ${urlCount}`);
      
      // Check for lastmod
      if (content.includes('<lastmod>')) {
        console.log('✅ Last modification dates included');
      } else {
        console.log('⚠️  RECOMMENDATION: Add lastmod dates to sitemap');
      }
      
      // Check for priority
      if (content.includes('<priority>')) {
        console.log('✅ Priority values included');
      }
      
    } else {
      console.log(`❌ sitemap.xml not accessible (${response.status})`);
    }
  } catch (error) {
    console.log(`❌ sitemap.xml check failed: ${error.message}`);
  }
}

async function runFullAnalysis() {
  await checkRedirects();
  await checkRobotsTxt();
  await checkSitemap();
  
  console.log('\n🎯 FINAL RECOMMENDATIONS FOR GOOGLE INDEXING:');
  console.log('1. 🔴 CRITICAL: Set up proper environment variables in production');
  console.log('2. 🔴 CRITICAL: Ensure no unintentional redirects in production');
  console.log('3. 🟡 IMPORTANT: Submit updated sitemap to Google Search Console');
  console.log('4. 🟡 IMPORTANT: Check GSC for specific crawl errors');
  console.log('5. 🟡 IMPORTANT: Verify canonical URLs are set correctly');
  console.log('6. 🟢 OPTIONAL: Add structured data testing');
}

if (require.main === module) {
  runFullAnalysis().catch(console.error);
}

module.exports = { checkRedirects, checkRobotsTxt, checkSitemap };