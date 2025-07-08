import 'dotenv/config';
import { BibleService } from '../services/bibleService';

async function testBibleService() {
  try {
    console.log('🧪 Testing BibleService...');
    
    const bibleService = new BibleService();
    
    // Test single verse
    console.log('\n📖 Testing single verse (Genesis 1:3)...');
    const singleVerse = await bibleService.getVerse('GEN', 1, 3);
    console.log('Single verse result:', {
      reference: singleVerse.reference,
      content: singleVerse.content.substring(0, 100) + '...'
    });
    
    // Test verse range
    console.log('\n📖 Testing verse range (Genesis 1:1-3)...');
    const verseRange = await bibleService.getVerseRange('GEN', 1, 1, 3);
    console.log('Verse range result:', {
      count: verseRange.length,
      references: verseRange.map(v => v.reference)
    });
    
    // Test scripture content parsing
    console.log('\n📖 Testing scripture content parsing...');
    const scriptureContent = await bibleService.getScriptureContent('Genesis 1:3');
    console.log('Scripture content result:', {
      reference: Array.isArray(scriptureContent) 
        ? scriptureContent[0]?.reference 
        : scriptureContent.reference
    });
    
    // Test your current format (GEN1.1-3)
    console.log('\n📖 Testing your current format (GEN1.1-3)...');
    const compactFormat = await bibleService.getScriptureContent('GEN1.1-3');
    console.log('Compact format result:', {
      count: Array.isArray(compactFormat) ? compactFormat.length : 1,
      references: Array.isArray(compactFormat) 
        ? compactFormat.map(v => v.reference)
        : [compactFormat.reference]
    });
    
    // Test multiple references
    console.log('\n📖 Testing multiple scripture references...');
    const multipleScriptures = await bibleService.getMultipleScriptures([
      'Genesis 1:1',
      'John 3:16',
      'Psalm 23:1'
    ]);
    console.log('Multiple scriptures result:', {
      count: multipleScriptures.length,
      references: multipleScriptures.map(v => v.reference)
    });
    
    // Test chapter reference
    console.log('\n📖 Testing chapter reference (Genesis 1)...');
    const chapterContent = await bibleService.getScriptureContent('Genesis 1');
    console.log('Chapter content result:', {
      count: Array.isArray(chapterContent) ? chapterContent.length : 1,
      references: Array.isArray(chapterContent) 
        ? chapterContent.slice(0, 3).map(v => v.reference)
        : [chapterContent.reference]
    });
    
    // Test direct chapter fetching
    console.log('\n📖 Testing direct chapter fetching (Genesis 1)...');
    const directChapter = await bibleService.getChapter('GEN', 1);
    console.log('Direct chapter result:', {
      count: directChapter.length,
      references: directChapter.slice(0, 3).map(v => v.reference)
    });
    
    // Test verse range with new efficient endpoint
    console.log('\n📖 Testing verse range with efficient endpoint (Genesis 1:1-5)...');
    const efficientRange = await bibleService.getVerseRange('GEN', 1, 1, 5);
    console.log('Efficient range result:', {
      count: efficientRange.length,
      references: efficientRange.map(v => v.reference)
    });
    
    console.log('\n✅ BibleService tests completed successfully!');
    
  } catch (error) {
    console.error('❌ BibleService test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testBibleService();
} 