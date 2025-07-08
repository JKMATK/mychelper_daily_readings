import { BibleVerse, BibleServiceConfig, ParsedReference } from '../types/bible';

export class BibleService {
  private config: BibleServiceConfig;

  constructor() {
    this.config = {
      apiKey: process.env.YOUVERSION_API_KEY || '',
      baseUrl: 'https://api-dev.youversion.com/v1/bibles',
      defaultVersion: 12
    };

    if (!this.config.apiKey) {
      throw new Error('YOUVERSION_API_KEY environment variable is required');
    }
  }

  /**
   * Fetch a single verse from YouVersion API
   */
  async getVerse(
    book: string, 
    chapter: number, 
    verse: number, 
    version: number = this.config.defaultVersion
  ): Promise<BibleVerse> {
    try {
      const url = `${this.config.baseUrl}/${version}/books/${book}/chapters/${chapter}/verses/${verse}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`YouVersion API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Clean up the content by removing extra whitespace and newlines
      if (data.content) {
        data.content = data.content
          .replace(/\\n/g, ' ')  // Replace \n with space
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .trim();               // Remove leading/trailing whitespace
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching verse ${book} ${chapter}:${verse}:`, error);
      throw new Error(`Failed to fetch Bible verse: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch multiple verses from a range using the efficient chapter endpoint
   */
  async getVerseRange(
    book: string, 
    chapter: number, 
    startVerse: number, 
    endVerse: number, 
    version: number = this.config.defaultVersion
  ): Promise<BibleVerse[]> {
    try {
      const url = `${this.config.baseUrl}/${version}/books/${book}/chapters/${chapter}/verses`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`YouVersion API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from YouVersion API');
      }

      // Clean up content for all verses
      const cleanedVerses = data.data.map((verse: any) => ({
        ...verse,
        content: verse.content
          ?.replace(/\\n/g, ' ')  // Replace \n with space
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .trim()               // Remove leading/trailing whitespace
      }));

      // Filter verses based on the requested range
      const filteredVerses = cleanedVerses.filter((verse: BibleVerse) => {
        const verseNumber = parseInt(verse.reference.split(':')[1]);
        return verseNumber >= startVerse && verseNumber <= endVerse;
      });

      return filteredVerses;
    } catch (error) {
      console.error(`Error fetching verse range ${book} ${chapter}:${startVerse}-${endVerse}:`, error);
      throw new Error(`Failed to fetch Bible verse range: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse scripture reference and fetch content
   * Supports formats like: "Genesis 1:3", "GEN 1:3", "1:3" (with book context)
   */
  async getScriptureContent(
    reference: string, 
    bookContext?: string, 
    version: number = this.config.defaultVersion
  ): Promise<BibleVerse | BibleVerse[]> {
    const parsed = this.parseReference(reference, bookContext);
    
    if (parsed.type === 'single') {
      return await this.getVerse(parsed.book, parsed.chapter, parsed.verse, version);
    } else {
      return await this.getVerseRange(
        parsed.book, 
        parsed.chapter, 
        parsed.startVerse || 1, 
        parsed.endVerse || 1, 
        version
      );
    }
  }

  /**
   * Fetch an entire chapter using the efficient chapter endpoint
   */
  async getChapter(
    book: string, 
    chapter: number, 
    version: number = this.config.defaultVersion
  ): Promise<BibleVerse[]> {
    try {
      const url = `${this.config.baseUrl}/${version}/books/${book}/chapters/${chapter}/verses`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`YouVersion API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from YouVersion API');
      }

      // Clean up content for all verses
      const cleanedVerses = data.data.map((verse: any) => ({
        ...verse,
        content: verse.content
          ?.replace(/\\n/g, ' ')  // Replace \n with space
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .trim()               // Remove leading/trailing whitespace
      }));

      return cleanedVerses;
    } catch (error) {
      console.error(`Error fetching chapter ${book} ${chapter}:`, error);
      throw new Error(`Failed to fetch Bible chapter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch multiple scripture references
   */
  async getMultipleScriptures(
    references: string[], 
    bookContext?: string, 
    version: number = this.config.defaultVersion
  ): Promise<BibleVerse[]> {
    const promises = references.map(ref => 
      this.getScriptureContent(ref, bookContext, version)
        .catch(error => {
          console.error(`Error fetching scripture ${ref}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    
    // Flatten results and filter out failed requests
    const verses: BibleVerse[] = [];
    results.forEach(result => {
      if (result) {
        if (Array.isArray(result)) {
          verses.push(...result);
        } else {
          verses.push(result);
        }
      }
    });
    
    return verses;
  }

  /**
   * Parse scripture reference string
   */
  private parseReference(reference: string, bookContext?: string): ParsedReference {
    // Remove extra whitespace and normalize
    const cleanRef = reference.trim().replace(/\s+/g, ' ');

    // 1. Compact pattern: e.g. 'GEN1.1-3', 'gen.1.1-3', 'gen 1.1-3' (case-insensitive)
    const compactPattern = /^([A-Za-z]+)[. ]?(\d+)\.(\d+)(?:-(\d+))?$/i;
    const compactMatch = cleanRef.match(compactPattern);
    if (compactMatch) {
      let [, book, chapter, verse, endVerse] = compactMatch;
      book = book.toLowerCase(); // Normalize to lowercase for mapping
      const bookAbbr = this.normalizeBookName(book);
      if (endVerse) {
        return {
          type: 'range',
          book: bookAbbr,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          startVerse: parseInt(verse),
          endVerse: parseInt(endVerse)
        };
      } else {
        return {
          type: 'single',
          book: bookAbbr,
          chapter: parseInt(chapter),
          verse: parseInt(verse)
        };
      }
    }

    // 2. Pattern for "Book Chapter:Verse" or "Book Chapter:Verse-Verse"
    const bookPattern = /^([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+):(\d+)(?:-(\d+))?$/;
    const match = cleanRef.match(bookPattern);
    if (match) {
      const [, book, chapter, verse, endVerse] = match;
      const bookAbbr = this.normalizeBookName(book);
      if (endVerse) {
        return {
          type: 'range',
          book: bookAbbr,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          startVerse: parseInt(verse),
          endVerse: parseInt(endVerse)
        };
      } else {
        return {
          type: 'single',
          book: bookAbbr,
          chapter: parseInt(chapter),
          verse: parseInt(verse)
        };
      }
    }

    // 3. Pattern for "Chapter:Verse" (requires book context)
    const chapterPattern = /^(\d+):(\d+)(?:-(\d+))?$/;
    const chapterMatch = cleanRef.match(chapterPattern);
    if (chapterMatch && bookContext) {
      const [, chapter, verse, endVerse] = chapterMatch;
      const bookAbbr = this.normalizeBookName(bookContext);
      if (endVerse) {
        return {
          type: 'range',
          book: bookAbbr,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          startVerse: parseInt(verse),
          endVerse: parseInt(endVerse)
        };
      } else {
        return {
          type: 'single',
          book: bookAbbr,
          chapter: parseInt(chapter),
          verse: parseInt(verse)
        };
      }
    }

    // 4. Pattern for "Book Chapter" (entire chapter)
    const chapterOnlyPattern = /^([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+)$/;
    const chapterOnlyMatch = cleanRef.match(chapterOnlyPattern);
    if (chapterOnlyMatch) {
      const [, book, chapter] = chapterOnlyMatch;
      const bookAbbr = this.normalizeBookName(book);
      return {
        type: 'range',
        book: bookAbbr,
        chapter: parseInt(chapter),
        verse: 1,
        startVerse: 1,
        endVerse: 50 // Default to 50 verses for chapter
      };
    }

    throw new Error(`Invalid scripture reference format: ${reference}`);
  }

  /**
   * Normalize book names to YouVersion abbreviations
   */
  private normalizeBookName(bookName: string): string {
    const bookMap: { [key: string]: string } = {
      // Old Testament
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

    const normalized = bookName.toLowerCase().trim();
    const abbreviation = bookMap[normalized];
    
    if (!abbreviation) {
      throw new Error(`Unknown book name: ${bookName}`);
    }
    
    return abbreviation;
  }

  /**
   * Fetch all verses in a chapter with pagination support
   */
  async getAllVersesInChapter(
    book: string, 
    chapter: number, 
    version: number = this.config.defaultVersion
  ): Promise<BibleVerse[]> {
    try {
      let allVerses: BibleVerse[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const url = `${this.config.baseUrl}/${version}/books/${book}/chapters/${chapter}/verses?page=${page}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`YouVersion API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid response format from YouVersion API');
        }

        // Clean up content for all verses
        const cleanedVerses = data.data.map((verse: any) => ({
          ...verse,
          content: verse.content
            ?.replace(/\\n/g, ' ')  // Replace \n with space
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .trim()               // Remove leading/trailing whitespace
        }));

        allVerses.push(...cleanedVerses);

        // Check if there are more pages
        hasMorePages = data.data.length > 0 && data.data.length >= 100; // Assuming 100 is the page size
        page++;
      }

      return allVerses;
    } catch (error) {
      console.error(`Error fetching all verses in chapter ${book} ${chapter}:`, error);
      throw new Error(`Failed to fetch all Bible verses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get service configuration
   */
  getConfig(): BibleServiceConfig {
    return { ...this.config };
  }
} 