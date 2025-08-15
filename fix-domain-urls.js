const fs = require('fs');
const path = require('path');

// Files that need domain URL fixes
const filesToUpdate = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/business/[slug]/page.tsx',
  'src/app/business/[slug]/not-found.tsx', 
  'src/app/restaurants/page.tsx',
  'src/app/retail/page.tsx',
  'src/app/services/page.tsx'
];

const oldDomain = 'https://nowopencalgary.ca';
const newDomain = 'https://www.nowopencalgary.ca';

console.log('🔧 Updating hardcoded domain URLs...\n');

filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Updating: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace all instances of the old domain
    content = content.replace(new RegExp(oldDomain, 'g'), newDomain);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      const replacements = (originalContent.match(new RegExp(oldDomain, 'g')) || []).length;
      console.log(`   ✅ Replaced ${replacements} URL(s)`);
    } else {
      console.log(`   ℹ️  No changes needed`);
    }
  } else {
    console.log(`   ⚠️  File not found: ${filePath}`);
  }
});

console.log('\n🎉 Domain URL update complete!');
console.log('\n📋 NEXT STEPS:');
console.log('1. Update these same URLs in your Vercel environment variables');
console.log('2. Deploy the changes to production');
console.log('3. Submit updated sitemap to Google Search Console');
console.log('4. Wait 24-48 hours for Google to re-crawl');