/**
 * Debug Pagination Script
 * 
 * This script tests the exact pagination issue with the YouVersion API.
 * 
 * USAGE:
 * npx tsx src/scripts/debugPagination.ts
 */

import 'dotenv/config';

async function debugPagination() {
  console.log('🔍 Debugging YouVersion API pagination...\n');
  
  const apiKey = process.env.YOUVERSION_API_KEY;
  const baseUrl = 'https://api-dev.youversion.com/v1/bibles';
  const version = 12;
  const book = 'MRK';
  const chapter = 9;
  
  if (!apiKey) {
    console.error('❌ YOUVERSION_API_KEY environment variable is required');
    return;
  }
  
  try {
    // Test 1: First page without page_token
    console.log('📖 Test 1: First page (no page_token)');
    const firstPageUrl = `${baseUrl}/${version}/books/${book}/chapters/${chapter}/verses`;
    console.log(`   URL: ${firstPageUrl}`);
    
    const firstResponse = await fetch(firstPageUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!firstResponse.ok) {
      console.log(`   ❌ First page failed: ${firstResponse.status} ${firstResponse.statusText}`);
      return;
    }
    
    const firstData = await firstResponse.json();
    console.log(`   ✅ First page successful: ${firstData.data?.length || 0} verses`);
    console.log(`   📄 next_page_token: ${firstData.next_page_token || 'null'}`);
    
    if (firstData.next_page_token) {
      // Test 2: Second page with page_token
      console.log('\n📖 Test 2: Second page (with page_token)');
      const secondPageUrl = `${baseUrl}/${version}/books/${book}/chapters/${chapter}/verses?page_token=${firstData.next_page_token}`;
      console.log(`   URL: ${secondPageUrl}`);
      
      const secondResponse = await fetch(secondPageUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!secondResponse.ok) {
        console.log(`   ❌ Second page failed: ${secondResponse.status} ${secondResponse.statusText}`);
        
        // Try with different parameter name
        console.log('\n📖 Test 2b: Second page (with page parameter)');
        const secondPageUrlAlt = `${baseUrl}/${version}/books/${book}/chapters/${chapter}/verses?page=2`;
        console.log(`   URL: ${secondPageUrlAlt}`);
        
        const secondResponseAlt = await fetch(secondPageUrlAlt, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!secondResponseAlt.ok) {
          console.log(`   ❌ Alternative second page failed: ${secondResponseAlt.status} ${secondResponseAlt.statusText}`);
        } else {
          const secondDataAlt = await secondResponseAlt.json();
          console.log(`   ✅ Alternative second page successful: ${secondDataAlt.data?.length || 0} verses`);
          console.log(`   📄 next_page_token: ${secondDataAlt.next_page_token || 'null'}`);
        }
      } else {
        const secondData = await secondResponse.json();
        console.log(`   ✅ Second page successful: ${secondData.data?.length || 0} verses`);
        console.log(`   📄 next_page_token: ${secondData.next_page_token || 'null'}`);
      }
    }
    
    // Test 3: Check if chapter has more than 25 verses
    console.log('\n📖 Test 3: Check total verses in chapter');
    let totalVerses = 0;
    let allVerses: any[] = [];
    let nextPageToken: string | null = null;
    let pageCount = 0;
    
    do {
      pageCount++;
      const url = nextPageToken 
        ? `${baseUrl}/${version}/books/${book}/chapters/${chapter}/verses?page_token=${nextPageToken}`
        : `${baseUrl}/${version}/books/${book}/chapters/${chapter}/verses`;
      
      console.log(`   📄 Page ${pageCount}: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.log(`   ❌ Page ${pageCount} failed: ${response.status} ${response.statusText}`);
        break;
      }
      
      const data = await response.json();
      const verseCount = data.data?.length || 0;
      totalVerses += verseCount;
      allVerses.push(...(data.data || []));
      
      console.log(`   ✅ Page ${pageCount}: ${verseCount} verses`);
      console.log(`   📄 next_page_token: ${data.next_page_token || 'null'}`);
      
      nextPageToken = data.next_page_token || null;
    } while (nextPageToken && pageCount < 10); // Safety limit
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total pages: ${pageCount}`);
    console.log(`   Total verses: ${totalVerses}`);
    console.log(`   Verses 33-41 available: ${allVerses.filter(v => {
      const verseNum = parseInt(v.usfm.split('.')[2]);
      return verseNum >= 33 && verseNum <= 41;
    }).length}`);
    
    // Show verse numbers
    const verseNumbers = allVerses.map(v => parseInt(v.usfm.split('.')[2])).sort((a, b) => a - b);
    console.log(`   Available verse numbers: ${verseNumbers.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugPagination(); 