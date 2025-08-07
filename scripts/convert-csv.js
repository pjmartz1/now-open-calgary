const fs = require('fs');
const path = require('path');

// Function to parse CSV data
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }
  
  return data;
}

// Function to convert CSV data to our app format
function convertToAppFormat(csvData) {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 2); // Last 2 years
  
  const convertedData = [];
  
  csvData.forEach((row, index) => {
    try {
      // Parse the first issue date
      const firstIssuedDate = new Date(row.FIRST_ISS_DT);
      
      // Skip if older than 2 years
      if (firstIssuedDate < cutoffDate) {
        return;
      }
      
      // Calculate days old
      const daysOld = Math.floor((Date.now() - firstIssuedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Skip if older than 730 days (2 years)
      if (daysOld > 730) {
        return;
      }
      
      // Convert business type to a more readable format
      let businessType = row.LICENCETYPES || 'General Business';
      if (businessType.includes('RESTAURANT') || businessType.includes('FOOD')) {
        businessType = 'Food Service';
      } else if (businessType.includes('RETAIL')) {
        businessType = 'Retail';
      } else if (businessType.includes('HEALTH') || businessType.includes('MEDICAL')) {
        businessType = 'Health & Wellness';
      } else if (businessType.includes('AUTOMOTIVE') || businessType.includes('MOTOR VEHICLE')) {
        businessType = 'Automotive';
      } else if (businessType.includes('SERVICE')) {
        businessType = 'Professional Services';
      } else if (businessType.includes('MANUFACTURER')) {
        businessType = 'Manufacturing';
      } else if (businessType.includes('CONTRACTOR')) {
        businessType = 'Contractor';
      } else if (businessType.includes('APARTMENT') || businessType.includes('BUILDING')) {
        businessType = 'Property Management';
      }
      
      // Convert community code to full name
      const communityMap = {
        'SSD': 'Sunnyside',
        'MAN': 'Manchester',
        'ING': 'Inglewood',
        'BLN': 'Beltline',
        'KEN': 'Kensington',
        'MIS': 'Mission',
        'HIL': 'Hillhurst',
        'SUN': 'Sunnyside',
        'BRD': 'Bridgeland',
        'CHI': 'Chinatown',
        'EAS': 'East Village',
        'MOU': 'Mount Royal',
        'SUN': 'Sunalta',
        'MAR': 'Marda Loop',
        'WES': 'West Hillhurst',
        'ROS': 'Rosedale',
        'ELB': 'Elbow Park',
        'RID': 'Rideau Park',
        'ALT': 'Altadore',
        'GAR': 'Garrison Woods'
      };
      
      const community = communityMap[row.COMDISTCD] || row.COMDISTNM || 'Calgary';
      
      convertedData.push({
        id: row.GETBUSID || `calgary-${Date.now()}-${index}`,
        business_name: row.TRADENAME || 'Unknown Business',
        trade_name: row.TRADENAME || null,
        business_type: businessType,
        business_category: row.LICENCETYPES || null,
        address: row.ADDRESS || 'Calgary, AB',
        community: community,
        ward: null, // Not in CSV
        first_iss_dt: row.FIRST_ISS_DT || new Date().toISOString(),
        status: row.JOBSTATUSDESC || 'Issued',
        phone: null, // Not in CSV
        website: null, // Not in CSV
        featured: false, // Will be set based on featured business IDs
        days_old: daysOld
      });
      
    } catch (error) {
      console.warn(`Error processing row ${index}:`, error);
    }
  });
  
  return convertedData;
}

// Main function
async function main() {
  try {
    console.log('🔄 Reading CSV file...');
    const csvPath = 'C:\\Users\\pmart\\Downloads\\Calgary_Business_Licences_20250807.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    console.log('📊 Parsing CSV data...');
    const csvData = parseCSV(csvContent);
    console.log(`✅ Parsed ${csvData.length} total records`);
    
    console.log('🔄 Converting to app format...');
    const convertedData = convertToAppFormat(csvData);
    console.log(`✅ Converted ${convertedData.length} recent businesses (last 2 years)`);
    
    // Save to a JSON file in the project
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'calgary-businesses.json');
    
    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(convertedData, null, 2));
    console.log(`💾 Saved to: ${outputPath}`);
    
    // Show some statistics
    const businessTypes = {};
    const communities = {};
    
    convertedData.forEach(business => {
      businessTypes[business.business_type] = (businessTypes[business.business_type] || 0) + 1;
      communities[business.community] = (communities[business.community] || 0) + 1;
    });
    
    console.log('\n📈 Business Type Distribution:');
    Object.entries(businessTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    
    console.log('\n🏘️ Community Distribution:');
    Object.entries(communities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([community, count]) => {
        console.log(`  ${community}: ${count}`);
      });
    
    console.log('\n✅ CSV conversion complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();


