import { BibleService } from './bibleService';

interface KatamerosRawData {
  date: string;
  apiDate: string;
  sortOrder: number;
  section: string;
  subSection: string;
  bookTranslation: string | null;
  ref: string | null;
  bookCode: string | null;
  formattedRef: string | null;
  contentType: string;
  content: string | null;
}

interface DailyReadingEntry {
  sortOrder: number;
  date: string;
  type: 'scripture' | 'text';
  references: string[];
  content: string | null;
}

export class LiturgicalService {
  public bibleService: BibleService;

  constructor() {
    this.bibleService = new BibleService();
  }

  // HTML Beautification Functions
  private beautifyIntroduction(content: string): string {
    // Clean and format the introduction text
    const cleanContent = content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return `<div class="liturgical-intro">
  <h3>📖 Introduction</h3>
  <p>${this.escapeHtmlContent(cleanContent)}</p>
</div>`;
  }

  private beautifyConclusion(content: string): string {
    // Clean and format the conclusion text
    const cleanContent = content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return `<div class="liturgical-conclusion">
  <h4>🙏 Conclusion</h4>
  <p>${this.escapeHtmlContent(cleanContent)}</p>
</div>`;
  }

  private beautifyScriptureReference(references: string[]): string {
    if (references.length === 0) return '';
    
    const referenceList = references.map(ref => `<span class="reference">${ref}</span>`).join(', ');
    
    return `<div class="scripture-reference">
  <h5>📜 Scripture Reading</h5>
  <p class="reference">${referenceList}</p>
</div>`;
  }

  private escapeHtmlContent(content: string): string {
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Fetch liturgical readings for a specific date from Katameros API
   */
  async fetchLiturgicalReadings(date: string): Promise<DailyReadingEntry[]> {
    try {
      console.log(`📖 Fetching liturgical readings for ${date}...`);
      
      // Convert date to DD-MM-YYYY format for Katameros API
      const dateObj = new Date(date);
      const apiDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
      
      // Fetch data from Katameros API
      const response = await fetch(`https://api.katameros.app/readings/gregorian/${apiDate}?languageId=2`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch liturgical readings: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const rawData = this.extractRawData(data, date, apiDate);
      
      // Transform to DailyReadingEntry format with filtering for Liturgy sections only and HTML beautification
      const dailyReadings: DailyReadingEntry[] = [];
      let newSortOrder = 1;
      
      rawData.forEach((item) => {
        // FILTER: Only process "Liturgy" sections (exclude Vespers, Matins, etc.)
        if (item.section === 'Liturgy') {
          let beautifiedContent: string | null = null;
          
          // Apply HTML beautification based on content type
          if (item.contentType === 'introduction' && item.content) {
            beautifiedContent = this.beautifyIntroduction(item.content);
          } else if (item.contentType === 'conclusion' && item.content) {
            beautifiedContent = this.beautifyConclusion(item.content);
          } else if (item.contentType === 'scripture') {
            // For scripture, we'll create a special formatted reference
            const references = item.formattedRef ? [item.formattedRef] : [];
            beautifiedContent = this.beautifyScriptureReference(references);
          }
          
          dailyReadings.push({
            sortOrder: newSortOrder++, // Reset sort order to 1-20 for Liturgy entries
            date: item.date,
            type: item.contentType === 'scripture' ? 'scripture' : 'text',
            references: item.formattedRef ? [item.formattedRef] : [], // Scripture references only
            content: beautifiedContent // Apply HTML beautification
          });
        }
      });
      
      console.log(`✅ Found ${dailyReadings.length} liturgical entries for ${date}`);
      return dailyReadings;
      
    } catch (error) {
      console.error(`❌ Error fetching liturgical readings for ${date}:`, error);
      throw error;
    }
  }

  /**
   * Fetch liturgical readings for a date range (for testing/analysis purposes)
   */
  async fetchLiturgicalReadingsForRange(startDate: string, endDate: string): Promise<DailyReadingEntry[]> {
    const allReadings: DailyReadingEntry[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    console.log(`📅 Fetching liturgical readings for ${totalDays} days (${startDate} to ${endDate})...`);
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      try {
        const readings = await this.fetchLiturgicalReadings(dateString);
        allReadings.push(...readings);
        
        // Add delay between requests to be respectful to the API
        if (i < totalDays - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Failed to fetch readings for ${dateString}:`, error);
        // Continue with other dates even if one fails
      }
    }
    
    console.log(`✅ Total liturgical readings fetched: ${allReadings.length}`);
    return allReadings;
  }

  /**
   * Split comma-separated references into individual references
   * Handles cases like "PSA132.9,10,1,2" -> ["PSA132.9", "PSA132.10", "PSA132.1", "PSA132.2"]
   */
  private splitCommaSeparatedReferences(reference: string): string[] {
    // Check if reference contains commas
    if (!reference.includes(',')) {
      return [reference];
    }
    
    // Extract book and chapter from the reference
    const match = reference.match(/^([A-Z]+)(\d+)\.(.+)$/);
    if (!match) {
      return [reference]; // Return as-is if we can't parse it
    }
    
    const [, book, chapter, versesPart] = match;
    const verses = versesPart.split(',').map(v => v.trim());
    
    // Create individual references
    return verses.map(verse => `${book}${chapter}.${verse}`);
  }

  /**
   * Helper function to convert book names to codes
   */
  private getBookCode(bookName: string): string {
    const bookMap: { [key: string]: string } = {
      'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
      'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
      '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
      'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
      'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
      'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
      'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
      'Micah': 'MIC', 'Nahum': 'NAH', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP',
      'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT',
      'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM',
      '1 Corinthians': '1CO', '2 Corinthians': '2CO', 'Galatians': 'GAL', 'Ephesians': 'EPH',
      'Philippians': 'PHP', 'Colossians': 'COL', '1 Thessalonians': '1TH', '2 Thessalonians': '2TH',
      '1 Timothy': '1TI', '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM',
      'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE',
      '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV'
    };
    return bookMap[bookName] || bookName.substring(0, 3).toUpperCase();
  }

  /**
   * Extract raw data from Katameros API response
   */
  private extractRawData(apiData: any, date: string, apiDate: string): KatamerosRawData[] {
    const rawData: KatamerosRawData[] = [];
    let sortOrder = 1;
    
    // Process each section (Vespers, Matins, Liturgy, etc.)
    if (apiData.sections) {
      apiData.sections.forEach((section: any) => {
        if (section.subSections) {
          section.subSections.forEach((subSection: any) => {
            // Add subsection introduction if it exists
            if (subSection.introduction) {
              rawData.push({
                date: date,
                apiDate: apiDate,
                sortOrder: sortOrder++,
                section: section.title || 'Unknown',
                subSection: subSection.title || 'Unknown',
                bookTranslation: null,
                ref: null,
                bookCode: null,
                formattedRef: null,
                contentType: 'introduction',
                content: subSection.introduction
              });
            }
            
            if (subSection.readings) {
              subSection.readings.forEach((reading: any) => {
                // Add reading introduction if it exists
                if (reading.introduction) {
                  rawData.push({
                    date: date,
                    apiDate: apiDate,
                    sortOrder: sortOrder++,
                    section: section.title || 'Unknown',
                    subSection: subSection.title || 'Unknown',
                    bookTranslation: null,
                    ref: null,
                    bookCode: null,
                    formattedRef: null,
                    contentType: 'introduction',
                    content: reading.introduction
                  });
                }
                
                // Extract scripture references from each passage
                if (reading.passages) {
                  reading.passages.forEach((passage: any) => {
                    if (passage.ref && passage.bookTranslation) {
                      // Convert to our format: "JHN1.1" instead of "John 1:1"
                      const bookCode = this.getBookCode(passage.bookTranslation);
                      const ref = passage.ref.replace(':', '.');
                      const formattedRef = `${bookCode}${ref}`;
                      
                      // Split comma-separated references into individual references
                      const individualRefs = this.splitCommaSeparatedReferences(formattedRef);
                      
                      individualRefs.forEach((individualRef) => {
                        rawData.push({
                          date: date,
                          apiDate: apiDate,
                          sortOrder: sortOrder++,
                          section: section.title || 'Unknown',
                          subSection: subSection.title || 'Unknown',
                          bookTranslation: passage.bookTranslation,
                          ref: passage.ref,
                          bookCode: bookCode,
                          formattedRef: individualRef,
                          contentType: 'scripture',
                          content: null
                        });
                      });
                    }
                  });
                }
                
                // Add reading conclusion if it exists
                if (reading.conclusion) {
                  rawData.push({
                    date: date,
                    apiDate: apiDate,
                    sortOrder: sortOrder++,
                    section: section.title || 'Unknown',
                    subSection: subSection.title || 'Unknown',
                    bookTranslation: null,
                    ref: null,
                    bookCode: null,
                    formattedRef: null,
                    contentType: 'conclusion',
                    content: reading.conclusion
                  });
                }
              });
            }
          });
        }
      });
    }
    
    return rawData;
  }
} 