/**
 * Test Reference Parsing Script
 * 
 * This script tests the reference parsing logic for liturgical readings
 * without requiring the Bible service API key.
 * 
 * USAGE:
 * npx tsx src/scripts/testReferenceParsing.ts
 */

/**
 * Test the compact pattern regex from BibleService
 */
function testCompactPattern() {
  console.log('🧪 Testing compact pattern regex...\n');
  
  const compactPattern = /^([0-9]*[A-Za-z]+)[. ]?(\d+)\.(\d+)(?:-(\d+))?$/i;
  
  const testCases = [
    '1PE5.1-14',
    '2CO11.16-33',
    'GEN1.1-3',
    'PSA132.9',
    'JHN1.1-5',
    'MAT5.1-12',
    'PSA23.1-6',
    'GEN1.1,2,3',
    'EXO20.1,2,3,4,5'
  ];
  
  console.log('📖 Testing compact pattern matching:');
  
  testCases.forEach((testCase, index) => {
    const match = testCase.match(compactPattern);
    if (match) {
      const [, book, chapter, verse, endVerse] = match;
      console.log(`   ${index + 1}. "${testCase}" -> book: "${book}", chapter: ${chapter}, verse: ${verse}${endVerse ? `, endVerse: ${endVerse}` : ''}`);
    } else {
      console.log(`   ${index + 1}. "${testCase}" -> NO MATCH`);
    }
  });
  
  console.log('\n✅ Compact pattern test completed!');
}

/**
 * Split comma-separated references into individual references
 * Handles cases like "PSA132.9,10,1,2" -> ["PSA132.9", "PSA132.10", "PSA132.1", "PSA132.2"]
 */
function splitCommaSeparatedReferences(reference: string): string[] {
  // Check if reference contains commas
  if (!reference.includes(',')) {
    return [reference];
  }
  
  // Extract book and chapter from the reference
  const match = reference.match(/^([0-9]*[A-Z]+)(\d+)\.(.+)$/);
  if (!match) {
    return [reference]; // Return as-is if we can't parse it
  }
  
  const [, book, chapter, versesPart] = match;
  const verses = versesPart.split(',').map(v => v.trim());
  
  // Create individual references
  return verses.map(verse => `${book}${chapter}.${verse}`);
}

function testReferenceParsing() {
  console.log('🧪 Testing reference parsing logic...\n');
  
  // Test cases from the error messages
  const testCases = [
    '1PE5.1-14',
    'PSA132.9,10,1,2',
    'JHN1.1-5',
    'MAT5.1-12',
    'PSA23.1-6',
    'GEN1.1,2,3',
    'EXO20.1,2,3,4,5'
  ];
  
  console.log('📖 Testing reference splitting:');
  
  testCases.forEach((testCase, index) => {
    try {
      const splitRefs = splitCommaSeparatedReferences(testCase);
      
      console.log(`   ${index + 1}. "${testCase}" -> [${splitRefs.map(ref => `"${ref}"`).join(', ')}]`);
      
      // Validate that each split reference follows the expected format
      splitRefs.forEach((ref: string) => {
        const isValid = /^[0-9]*[A-Z]+\d+\.\d+(-\d+)?$/.test(ref);
        if (!isValid) {
          console.log(`      ⚠️  Warning: "${ref}" may not be in valid format`);
        }
      });
      
    } catch (error) {
      console.log(`   ${index + 1}. "${testCase}" -> ERROR: ${error}`);
    }
  });
  
  console.log('\n✅ Reference parsing test completed!');
}

// Run the tests
testCompactPattern();
console.log('\n' + '='.repeat(50) + '\n');
testReferenceParsing(); 