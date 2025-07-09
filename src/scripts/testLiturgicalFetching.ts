/**
 * Test Liturgical Fetching Script
 * 
 * This script tests the real-time fetching of liturgical readings from the Katameros API.
 * 
 * USAGE:
 * npx tsx src/scripts/testLiturgicalFetching.ts [date]
 * 
 * EXAMPLE:
 * npx tsx src/scripts/testLiturgicalFetching.ts 2025-01-15
 */
import { LiturgicalService } from '../services/liturgicalService';

async function testLiturgicalFetching(date?: string) {
  try {
    console.log('🧪 Testing liturgical readings fetching...\n');
    
    const liturgicalService = new LiturgicalService();
    const testDate = date || new Date().toISOString().split('T')[0];
    
    console.log(`📅 Testing date: ${testDate}\n`);
    
    // Test single date fetching
    console.log('📖 Fetching liturgical readings...');
    const startTime = Date.now();
    
    const readings = await liturgicalService.fetchLiturgicalReadings(testDate);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`\n✅ Fetch completed in ${duration}ms`);
    console.log(`📊 Found ${readings.length} liturgical entries\n`);
    
    // Display sample entries
    console.log('📖 Sample Entries:');
    readings.slice(0, 5).forEach((reading, index) => {
      if (reading.type === 'scripture') {
        console.log(`   ${index + 1}. ${reading.type}: ${reading.references.join(', ')}`);
      } else {
        console.log(`   ${index + 1}. ${reading.type}: ${reading.content?.substring(0, 50)}...`);
      }
    });
    
    if (readings.length > 5) {
      console.log(`   ... and ${readings.length - 5} more entries`);
    }
    
    // Test Bible content fetching for scripture entries
    const scriptureEntries = readings.filter(r => r.type === 'scripture' && r.references.length > 0);
    
    if (scriptureEntries.length > 0) {
      console.log('\n📖 Testing Bible content fetching...');
      const bibleStartTime = Date.now();
      
      const readingsWithBible = await Promise.all(
        scriptureEntries.slice(0, 3).map(async (reading) => {
          try {
            const bibleContent = await liturgicalService.bibleService.getMultipleScriptures(reading.references);
            return {
              ...reading,
              bibleContent
            };
          } catch (error) {
            console.error(`Error fetching Bible content for ${reading.references.join(', ')}:`, error);
            return {
              ...reading,
              bibleContent: []
            };
          }
        })
      );
      
      const bibleEndTime = Date.now();
      const bibleDuration = bibleEndTime - bibleStartTime;
      
      console.log(`✅ Bible content fetched in ${bibleDuration}ms`);
      
      readingsWithBible.forEach((reading, index) => {
        console.log(`   ${index + 1}. ${reading.references.join(', ')}: ${reading.bibleContent.length} verses`);
      });
    }
    
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const testDate = args[0];

// Validate date format if provided
if (testDate) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(testDate)) {
    console.error('❌ Invalid date format. Use YYYY-MM-DD format (e.g., 2025-01-15)');
    process.exit(1);
  }
}

// Run the test
testLiturgicalFetching(testDate); 