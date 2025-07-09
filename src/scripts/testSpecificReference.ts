/**
 * Test Specific Reference Script
 * 
 * This script tests a specific scripture reference to debug why it's returning empty content.
 * 
 * USAGE:
 * npx tsx src/scripts/testSpecificReference.ts
 */

/**
 * Test the compact pattern regex from BibleService for a specific reference
 */
function testSpecificReference() {
  console.log('🧪 Testing specific reference: MRK9.33-41\n');
  
  const compactPattern = /^([0-9]*[A-Za-z]+)[. ]?(\d+)\.(\d+)(?:-(\d+))?$/i;
  const testRef = 'MRK9.33-41';
  
  console.log(`📖 Testing reference: "${testRef}"`);
  
  const match = testRef.match(compactPattern);
  if (match) {
    const [, book, chapter, verse, endVerse] = match;
    console.log(`✅ Parsed successfully:`);
    console.log(`   - Book: "${book}"`);
    console.log(`   - Chapter: ${chapter}`);
    console.log(`   - Verse: ${verse}`);
    console.log(`   - End Verse: ${endVerse || 'none'}`);
    
    // Test if the book code is recognized
    const bookMap: { [key: string]: string } = {
      'genesis': 'GEN', 'gen': 'GEN',
      'exodus': 'EXO', 'exo': 'EXO',
      'leviticus': 'LEV', 'lev': 'LEV',
      'numbers': 'NUM', 'num': 'NUM',
      'deuteronomy': 'DEU', 'deu': 'DEU',
      'joshua': 'JOS', 'jos': 'JOS',
      'judges': 'JDG', 'jdg': 'JDG',
      'ruth': 'RUT', 'rut': 'RUT',
      '1 samuel': '1SA', '1sa': '1SA', '1 sam': '1SA',
      '2 samuel': '2SA', '2sa': '2SA', '2 sam': '2SA',
      '1 kings': '1KI', '1ki': '1KI', '1 kgs': '1KI',
      '2 kings': '2KI', '2ki': '2KI', '2 kgs': '2KI',
      '1 chronicles': '1CH', '1ch': '1CH', '1 chr': '1CH',
      '2 chronicles': '2CH', '2ch': '2CH', '2 chr': '2CH',
      'ezra': 'EZR', 'ezr': 'EZR',
      'nehemiah': 'NEH', 'neh': 'NEH',
      'esther': 'EST', 'est': 'EST',
      'job': 'JOB',
      'psalms': 'PSA', 'psa': 'PSA', 'psalm': 'PSA',
      'proverbs': 'PRO', 'pro': 'PRO', 'prov': 'PRO',
      'ecclesiastes': 'ECC', 'ecc': 'ECC', 'eccl': 'ECC',
      'song of solomon': 'SNG', 'sng': 'SNG', 'song': 'SNG',
      'isaiah': 'ISA', 'isa': 'ISA',
      'jeremiah': 'JER', 'jer': 'JER',
      'lamentations': 'LAM', 'lam': 'LAM',
      'ezekiel': 'EZK', 'ezk': 'EZK', 'ezek': 'EZK',
      'daniel': 'DAN', 'dan': 'DAN',
      'hosea': 'HOS', 'hos': 'HOS',
      'joel': 'JOL', 'jol': 'JOL',
      'amos': 'AMO', 'amo': 'AMO',
      'obadiah': 'OBA', 'oba': 'OBA',
      'jonah': 'JON', 'jon': 'JON',
      'micah': 'MIC', 'mic': 'MIC',
      'nahum': 'NAM', 'nam': 'NAM',
      'habakkuk': 'HAB', 'hab': 'HAB',
      'zephaniah': 'ZEP', 'zep': 'ZEP',
      'haggai': 'HAG', 'hag': 'HAG',
      'zechariah': 'ZEC', 'zec': 'ZEC',
      'malachi': 'MAL', 'mal': 'MAL',
      
      // New Testament
      'matthew': 'MAT', 'mat': 'MAT', 'matt': 'MAT',
      'mark': 'MRK', 'mrk': 'MRK',
      'luke': 'LUK', 'luk': 'LUK',
      'john': 'JHN', 'jhn': 'JHN',
      'acts': 'ACT', 'act': 'ACT',
      'romans': 'ROM', 'rom': 'ROM',
      '1 corinthians': '1CO', '1co': '1CO', '1 cor': '1CO',
      '2 corinthians': '2CO', '2co': '2CO', '2 cor': '2CO',
      'galatians': 'GAL', 'gal': 'GAL',
      'ephesians': 'EPH', 'eph': 'EPH',
      'philippians': 'PHP', 'php': 'PHP', 'phil': 'PHP',
      'colossians': 'COL', 'col': 'COL',
      '1 thessalonians': '1TH', '1th': '1TH', '1 thes': '1TH',
      '2 thessalonians': '2TH', '2th': '2TH', '2 thes': '2TH',
      '1 timothy': '1TI', '1ti': '1TI', '1 tim': '1TI',
      '2 timothy': '2TI', '2ti': '2TI', '2 tim': '2TI',
      'titus': 'TIT', 'tit': 'TIT',
      'philemon': 'PHM', 'phm': 'PHM',
      'hebrews': 'HEB', 'heb': 'HEB',
      'james': 'JAS', 'jas': 'JAS',
      '1 peter': '1PE', '1pe': '1PE', '1 pet': '1PE',
      '2 peter': '2PE', '2pe': '2PE', '2 pet': '2PE',
      '1 john': '1JN', '1jn': '1JN', '1 joh': '1JN',
      '2 john': '2JN', '2jn': '2JN', '2 joh': '2JN',
      '3 john': '3JN', '3jn': '3JN', '3 joh': '3JN',
      'jude': 'JUD', 'jud': 'JUD',
      'revelation': 'REV', 'rev': 'REV'
    };
    
    const normalized = book.toLowerCase().trim();
    const abbreviation = bookMap[normalized];
    
    if (abbreviation) {
      console.log(`✅ Book code "${book}" is recognized as "${abbreviation}"`);
    } else {
      console.log(`❌ Book code "${book}" is NOT recognized in the book map`);
    }
    
  } else {
    console.log(`❌ Failed to parse reference: "${testRef}"`);
  }
  
  console.log('\n✅ Test completed!');
}

// Run the test
testSpecificReference(); 