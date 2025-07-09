/**
 * Test Bible Service Script
 * 
 * This script directly tests the Bible service to see why MRK9.33-41 is returning empty content.
 * 
 * USAGE:
 * npx tsx src/scripts/testBibleService.ts
 */

import 'dotenv/config';
import { BibleService } from '../services/bibleService';

async function testBibleService() {
  console.log('🧪 Testing Bible Service with MRK9.33-41\n');
  
  try {
    const bibleService = new BibleService();
    
    console.log('📖 Testing reference: MRK9.33-41');
    
    // Test the parseReference method first
    const testRef = 'MRK9.33-41';
    console.log(`\n1. Testing parseReference for "${testRef}":`);
    
    try {
      // Access the private method using bracket notation
      const parsed = (bibleService as any).parseReference(testRef);
      console.log(`   ✅ Parsed successfully:`, parsed);
    } catch (error) {
      console.log(`   ❌ Parse failed:`, error);
      return;
    }
    
    // Test getting scripture content
    console.log(`\n2. Testing getScriptureContent for "${testRef}":`);
    
    try {
      const content = await bibleService.getScriptureContent(testRef);
      console.log(`   ✅ Content fetched successfully:`);
      console.log(`   - Type: ${Array.isArray(content) ? 'array' : 'single'}`);
      console.log(`   - Length: ${Array.isArray(content) ? content.length : 1}`);
      
      if (Array.isArray(content)) {
        content.forEach((verse, index) => {
          console.log(`   - Verse ${index + 1}: ${verse.book} ${verse.chapter}:${verse.verse} - "${verse.content?.substring(0, 50)}..."`);
        });
      } else {
        console.log(`   - Single verse: ${content.book} ${content.chapter}:${content.verse} - "${content.content?.substring(0, 50)}..."`);
      }
    } catch (error) {
      console.log(`   ❌ Content fetch failed:`, error);
    }
    
    // Test getting multiple scriptures
    console.log(`\n3. Testing getMultipleScriptures for ["${testRef}"]:`);
    
    try {
      const multipleContent = await bibleService.getMultipleScriptures([testRef]);
      console.log(`   ✅ Multiple scriptures fetched successfully:`);
      console.log(`   - Length: ${multipleContent.length}`);
      
      multipleContent.forEach((verse, index) => {
        console.log(`   - Verse ${index + 1}: ${verse.book} ${verse.chapter}:${verse.verse} - "${verse.content?.substring(0, 50)}..."`);
      });
    } catch (error) {
      console.log(`   ❌ Multiple scriptures fetch failed:`, error);
    }
    
    // Test individual verse fetching
    console.log(`\n4. Testing individual verse fetching for Mark 9:33:`);
    
    try {
      const singleVerse = await bibleService.getVerse('MRK', 9, 33);
      console.log(`   ✅ Single verse fetched successfully:`);
      console.log(`   - ${singleVerse.book} ${singleVerse.chapter}:${singleVerse.verse} - "${singleVerse.content?.substring(0, 50)}..."`);
    } catch (error) {
      console.log(`   ❌ Single verse fetch failed:`, error);
    }
    
    // Test verse range fetching
    console.log(`\n5. Testing verse range fetching for Mark 9:33-41:`);
    
    try {
      const verseRange = await bibleService.getVerseRange('MRK', 9, 33, 41);
      console.log(`   ✅ Verse range fetched successfully:`);
      console.log(`   - Length: ${verseRange.length}`);
      
      verseRange.forEach((verse, index) => {
        console.log(`   - Verse ${index + 1}: ${verse.book} ${verse.chapter}:${verse.verse} - "${verse.content?.substring(0, 50)}..."`);
      });
    } catch (error) {
      console.log(`   ❌ Verse range fetch failed:`, error);
    }
    
  } catch (error) {
    console.error('❌ Bible service initialization failed:', error);
  }
  
  console.log('\n✅ Test completed!');
}

// Run the test
testBibleService(); 