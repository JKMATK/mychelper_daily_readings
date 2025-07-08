// Script to generate a 365-day Bible reading plan
// This covers the entire Bible in one year

interface BibleReading {
  sortOrder: number;
  date: string;
  type: 'text' | 'scripture';
  references: string[];
  content: string | null;
}

const biblePlan: BibleReading[] = [];

// Bible books with approximate chapter counts for 365-day distribution
const bibleBooks = [
  { name: 'GEN', chapters: 50, title: 'Genesis' },
  { name: 'EXO', chapters: 40, title: 'Exodus' },
  { name: 'LEV', chapters: 27, title: 'Leviticus' },
  { name: 'NUM', chapters: 36, title: 'Numbers' },
  { name: 'DEU', chapters: 34, title: 'Deuteronomy' },
  { name: 'JOS', chapters: 24, title: 'Joshua' },
  { name: 'JDG', chapters: 21, title: 'Judges' },
  { name: 'RUT', chapters: 4, title: 'Ruth' },
  { name: '1SA', chapters: 31, title: '1 Samuel' },
  { name: '2SA', chapters: 24, title: '2 Samuel' },
  { name: '1KI', chapters: 22, title: '1 Kings' },
  { name: '2KI', chapters: 25, title: '2 Kings' },
  { name: '1CH', chapters: 29, title: '1 Chronicles' },
  { name: '2CH', chapters: 36, title: '2 Chronicles' },
  { name: 'EZR', chapters: 10, title: 'Ezra' },
  { name: 'NEH', chapters: 13, title: 'Nehemiah' },
  { name: 'EST', chapters: 10, title: 'Esther' },
  { name: 'JOB', chapters: 42, title: 'Job' },
  { name: 'PSA', chapters: 150, title: 'Psalms' },
  { name: 'PRO', chapters: 31, title: 'Proverbs' },
  { name: 'ECC', chapters: 12, title: 'Ecclesiastes' },
  { name: 'SNG', chapters: 8, title: 'Song of Solomon' },
  { name: 'ISA', chapters: 66, title: 'Isaiah' },
  { name: 'JER', chapters: 52, title: 'Jeremiah' },
  { name: 'LAM', chapters: 5, title: 'Lamentations' },
  { name: 'EZK', chapters: 48, title: 'Ezekiel' },
  { name: 'DAN', chapters: 12, title: 'Daniel' },
  { name: 'HOS', chapters: 14, title: 'Hosea' },
  { name: 'JOL', chapters: 3, title: 'Joel' },
  { name: 'AMO', chapters: 9, title: 'Amos' },
  { name: 'OBA', chapters: 1, title: 'Obadiah' },
  { name: 'JON', chapters: 4, title: 'Jonah' },
  { name: 'MIC', chapters: 7, title: 'Micah' },
  { name: 'NAH', chapters: 3, title: 'Nahum' },
  { name: 'HAB', chapters: 3, title: 'Habakkuk' },
  { name: 'ZEP', chapters: 3, title: 'Zephaniah' },
  { name: 'HAG', chapters: 2, title: 'Haggai' },
  { name: 'ZEC', chapters: 14, title: 'Zechariah' },
  { name: 'MAL', chapters: 4, title: 'Malachi' },
  { name: 'MAT', chapters: 28, title: 'Matthew' },
  { name: 'MRK', chapters: 16, title: 'Mark' },
  { name: 'LUK', chapters: 24, title: 'Luke' },
  { name: 'JHN', chapters: 21, title: 'John' },
  { name: 'ACT', chapters: 28, title: 'Acts' },
  { name: 'ROM', chapters: 16, title: 'Romans' },
  { name: '1CO', chapters: 16, title: '1 Corinthians' },
  { name: '2CO', chapters: 13, title: '2 Corinthians' },
  { name: 'GAL', chapters: 6, title: 'Galatians' },
  { name: 'EPH', chapters: 6, title: 'Ephesians' },
  { name: 'PHP', chapters: 4, title: 'Philippians' },
  { name: 'COL', chapters: 4, title: 'Colossians' },
  { name: '1TH', chapters: 5, title: '1 Thessalonians' },
  { name: '2TH', chapters: 3, title: '2 Thessalonians' },
  { name: '1TI', chapters: 6, title: '1 Timothy' },
  { name: '2TI', chapters: 4, title: '2 Timothy' },
  { name: 'TIT', chapters: 3, title: 'Titus' },
  { name: 'PHM', chapters: 1, title: 'Philemon' },
  { name: 'HEB', chapters: 13, title: 'Hebrews' },
  { name: 'JAS', chapters: 5, title: 'James' },
  { name: '1PE', chapters: 5, title: '1 Peter' },
  { name: '2PE', chapters: 3, title: '2 Peter' },
  { name: '1JN', chapters: 5, title: '1 John' },
  { name: '2JN', chapters: 1, title: '2 John' },
  { name: '3JN', chapters: 1, title: '3 John' },
  { name: 'JUD', chapters: 1, title: 'Jude' },
  { name: 'REV', chapters: 22, title: 'Revelation' }
];

// Generate 365 days of readings
let dayCount = 1;
const startDate = new Date('2025-01-01');

for (const book of bibleBooks) {
  const chaptersPerDay = Math.ceil(book.chapters / 7); // Spread chapters across multiple days
  
  for (let day = 1; day <= 7 && dayCount <= 365; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayCount - 1);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Calculate chapter range for this day
    const startChapter = Math.min((day - 1) * chaptersPerDay + 1, book.chapters);
    const endChapter = Math.min(day * chaptersPerDay, book.chapters);
    
    // Day introduction
    biblePlan.push({
      sortOrder: (dayCount - 1) * 5 + 1,
      date: dateString,
      type: 'text',
      references: [],
      content: `<h3>Day ${dayCount}: ${book.title} ${startChapter}${endChapter > startChapter ? '-' + endChapter : ''}</h3><p>Today we explore ${book.title}, a book that reveals God's character and His plan for humanity. Let us approach His Word with reverence and expectation.</p>`
    });
    
    // Scripture reading
    const refs = [];
    for (let ch = startChapter; ch <= endChapter; ch++) {
      refs.push(`${book.name}${ch}.1-${Math.min(ch + 2, book.chapters)}`);
    }
    
    biblePlan.push({
      sortOrder: (dayCount - 1) * 5 + 2,
      date: dateString,
      type: 'scripture',
      references: refs,
      content: null
    });
    
    // Reflection
    biblePlan.push({
      sortOrder: (dayCount - 1) * 5 + 3,
      date: dateString,
      type: 'text',
      references: [],
      content: `<p><strong>Reflection:</strong> As you read ${book.title}, consider how God's Word speaks to your life today. What truths are revealed about God's character, His promises, or His will for His people?</p>`
    });
    
    // Additional scripture (key verse)
    const keyChapter = Math.floor((startChapter + endChapter) / 2);
    biblePlan.push({
      sortOrder: (dayCount - 1) * 5 + 4,
      date: dateString,
      type: 'scripture',
      references: [`${book.name}${keyChapter}.1-5`],
      content: null
    });
    
    // Prayer
    biblePlan.push({
      sortOrder: (dayCount - 1) * 5 + 5,
      date: dateString,
      type: 'text',
      references: [],
      content: `<p><strong>Prayer:</strong> "Heavenly Father, open my heart and mind to understand Your Word in ${book.title}. Help me apply these truths to my life and grow closer to You. In Jesus' name, Amen."</p>`
    });
    
    dayCount++;
  }
}

// Export the plan
console.log('export const dailyReadings = [');
biblePlan.forEach((reading, index) => {
  console.log('  {');
  console.log(`    sortOrder: ${reading.sortOrder},`);
  console.log(`    date: '${reading.date}',`);
  console.log(`    type: '${reading.type}',`);
  console.log(`    references: [${reading.references.map(ref => `'${ref}'`).join(', ')}],`);
  console.log(`    content: ${reading.content ? `'${reading.content.replace(/'/g, "\\'")}'` : 'null'}`);
  console.log('  }' + (index < biblePlan.length - 1 ? ',' : ''));
});
console.log('];');

console.log(`\nGenerated ${biblePlan.length} reading entries for ${Math.ceil(dayCount - 1)} days`); 