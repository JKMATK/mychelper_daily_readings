/**
 * Debug API Response Script
 * 
 * This script shows the actual structure of the YouVersion API response.
 * 
 * USAGE:
 * npx tsx src/scripts/debugApiResponse.ts
 */

import 'dotenv/config';

async function debugApiResponse() {
  console.log('🔍 Debugging YouVersion API response structure...\n');
  
  const apiKey = process.env.YOUVERSION_API_KEY;
  const baseUrl = 'https://api-dev.youversion.com/v1/bibles';
  const version = 12;
  const book = 'MRK';
  const chapter = 9;
  const verse = 33;
  
  if (!apiKey) {
    console.error('❌ YOUVERSION_API_KEY environment variable is required');
    return;
  }
  
  try {
    // Test single verse response
    console.log('📖 Testing single verse response:');
    const singleVerseUrl = `${baseUrl}/${version}/books/${book}/chapters/${chapter}/verses/${verse}`;
    console.log(`   URL: ${singleVerseUrl}`);
    
    const singleResponse = await fetch(singleVerseUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!singleResponse.ok) {
      console.log(`   ❌ Single verse failed: ${singleResponse.status} ${singleResponse.statusText}`);
      return;
    }
    
    const singleData = await singleResponse.json();
    console.log(`   ✅ Single verse response structure:`);
    console.log(`   - Keys: ${Object.keys(singleData).join(', ')}`);
    console.log(`   - Full response:`, JSON.stringify(singleData, null, 2));
    
    // Test chapter response
    console.log('\n📖 Testing chapter response:');
    const chapterUrl = `${baseUrl}/${version}/books/${book}/chapters/${chapter}/verses`;
    console.log(`   URL: ${chapterUrl}`);
    
    const chapterResponse = await fetch(chapterUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!chapterResponse.ok) {
      console.log(`   ❌ Chapter failed: ${chapterResponse.status} ${chapterResponse.statusText}`);
      return;
    }
    
    const chapterData = await chapterResponse.json();
    console.log(`   ✅ Chapter response structure:`);
    console.log(`   - Keys: ${Object.keys(chapterData).join(', ')}`);
    console.log(`   - Data length: ${chapterData.data?.length || 0}`);
    
    if (chapterData.data && chapterData.data.length > 0) {
      const firstVerse = chapterData.data[0];
      console.log(`   - First verse keys: ${Object.keys(firstVerse).join(', ')}`);
      console.log(`   - First verse:`, JSON.stringify(firstVerse, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugApiResponse(); 