/**
 * Katameros to DailyReadings Transformer
 * 
 * This script extracts liturgical readings from the Katameros API and transforms them
 * into the DailyReadings.ts schema format for the MyCHelper app.
 * 
 * SPECIFIC REQUIREMENTS & FILTERING:
 * - API: https://api.katameros.app/readings/gregorian/{DD-MM-YYYY}?languageId=2
 * - Date Format: DD-MM-YYYY (NOT MM-DD-YYYY) for Katameros API
 * - Sections: ONLY "Liturgy" sections (filters out Vespers, Matins, etc.)
 * - Content Types: introduction, scripture, conclusion
 * - Scripture Content: Set to null (ready for Bible service to populate)
 * - Text Content: Preserves actual liturgical text (introductions, conclusions) with HTML beautification
 * - Sort Order: Resets to 1-20 for Liturgy entries (not preserving raw order)
 * - References: Formatted as "BOOK.CHAPTER.VERSE" (e.g., "2CO11.16-33")
 * 
 * HTML BEAUTIFICATION:
 * - Introductions: <div class="liturgical-intro"><h3>📖 Introduction</h3><p>content</p></div>
 * - Conclusions: <div class="liturgical-conclusion"><h4>🙏 Conclusion</h4><p>content</p></div>
 * - Scripture: <div class="scripture-reference"><h5>📜 Scripture</h5><p class="reference">reference</p></div>
 * 
 * OUTPUT FILES:
 * - katameros-raw-data.json: Complete raw data from API (all sections)
 * - katameros-daily-readings.ts: Final schema format (Liturgy only) with HTML formatting
 * 
 * USAGE:
 * npx tsx src/scripts/katamerosToDailyReadings.ts
 */
import * as fs from 'fs';
import * as path from 'path';

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

interface DailyReading {
  sortOrder: number;
  date: string;
  type: string;
  references: string[];
  content: string | null;
}

// HTML Beautification Functions
function beautifyIntroduction(content: string): string {
  // Clean and format the introduction text
  const cleanContent = content
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return `<div class="liturgical-intro">
  <h3>📖 Introduction</h3>
  <p>${cleanContent}</p>
</div>`;
}

function beautifyConclusion(content: string): string {
  // Clean and format the conclusion text
  const cleanContent = content
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return `<div class="liturgical-conclusion">
  <h4>🙏 Conclusion</h4>
  <p>${cleanContent}</p>
</div>`;
}

function beautifyScriptureReference(references: string[]): string {
  if (references.length === 0) return '';
  
  const referenceList = references.map(ref => `<span class="reference">${ref}</span>`).join(', ');
  
  return `<div class="scripture-reference">
  <h5>📜 Scripture Reading</h5>
  <p class="reference">${referenceList}</p>
</div>`;
}

function escapeHtmlContent(content: string): string {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function katamerosToDailyReadings(startDateStr?: string, endDateStr?: string) {
  try {
    console.log('📖 Extracting Katameros data and transforming to DailyReadings schema...\n');
    
    const allRawData: KatamerosRawData[] = [];
    
    // Use provided dates or default to today
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    console.log(`📅 Processing ${totalDays} days...`);
    
    for (let i = 0; i < totalDays; i++) {
      // Create date by adding days to start date
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Format date for Katameros API (DD-MM-YYYY) - IMPORTANT: Katameros expects DD-MM-YYYY, not MM-DD-YYYY
      const apiDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
      const dbDate = currentDate.toISOString().split('T')[0];
      
      console.log(`📖 Fetching ${dbDate} (${i + 1}/${totalDays})...`);
      console.log(`   Debug: currentDate=${currentDate.toISOString()}, apiDate=${apiDate}`);
      
      // Retry logic for failed requests
      let retries = 3;
      let success = false;
      
      while (retries > 0 && !success) {
        try {
          const response = await fetch(`https://api.katameros.app/readings/gregorian/${apiDate}?languageId=2`);
          
          if (response.ok) {
            const data = await response.json();
            const rawData = extractRawData(data, dbDate, apiDate);
            allRawData.push(...rawData);
            
            console.log(`   ✅ Found ${rawData.length} total entries`);
            success = true;
          } else {
            console.log(`⚠️  Could not fetch data for ${dbDate} - Status: ${response.status} (${retries} retries left)`);
            
            if (retries > 1) {
              console.log(`   Waiting 5 seconds before retry...`);
              await new Promise(resolve => setTimeout(resolve, 5000));
            }
            retries--;
          }
          
        } catch (error) {
          console.log(`❌ Error fetching data for ${dbDate}: ${error} (${retries} retries left)`);
          
          if (retries > 1) {
            console.log(`   Waiting 5 seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
          retries--;
        }
      }
      
      if (!success) {
        console.log(`❌ Failed to fetch data for ${dbDate} after all retries`);
      }
      
      // Delay between requests to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Save raw data to file (optional, for debugging)
    const rawDataPath = path.join(__dirname, 'katameros-raw-data.json');
    fs.writeFileSync(rawDataPath, JSON.stringify(allRawData, null, 2));
    
    console.log('\n🔄 Transforming to DailyReadings schema...');
    
    // Transform to DailyReadings format with specific filtering requirements and HTML beautification
    const dailyReadings: DailyReading[] = [];
    let newSortOrder = 1;
    
    allRawData.forEach((item) => {
      // FILTER: Only process "Liturgy" sections (exclude Vespers, Matins, etc.)
      if (item.section === 'Liturgy') {
        let beautifiedContent: string | null = null;
        
        // Apply HTML beautification based on content type
        if (item.contentType === 'introduction' && item.content) {
          beautifiedContent = beautifyIntroduction(escapeHtmlContent(item.content));
        } else if (item.contentType === 'conclusion' && item.content) {
          beautifiedContent = beautifyConclusion(escapeHtmlContent(item.content));
        } else if (item.contentType === 'scripture') {
          // For scripture, we'll create a special formatted reference
          const references = item.formattedRef ? [item.formattedRef] : [];
          beautifiedContent = beautifyScriptureReference(references);
        }
        
        dailyReadings.push({
          sortOrder: newSortOrder++, // Reset sort order to 1-20 for Liturgy entries
          date: item.date,
          type: item.contentType, // introduction, scripture, or conclusion
          references: item.formattedRef ? [item.formattedRef] : [], // Scripture references only
          content: beautifiedContent // Apply HTML beautification
        });
      }
    });
    
    // Save to DailyReadings format
    const outputPath = path.join(__dirname, 'katameros-daily-readings.ts');
    
    let outputContent = 'export const dailyReadings = [\n';
    
    dailyReadings.forEach((reading, index) => {
      outputContent += '  {\n';
      outputContent += `    sortOrder: ${reading.sortOrder},\n`;
      outputContent += `    date: '${reading.date}',\n`;
      outputContent += `    type: '${reading.type}',\n`;
      outputContent += `    references: [${reading.references.map(ref => `'${ref}'`).join(', ')}],\n`;
      outputContent += `    content: ${reading.content ? `\`${reading.content.replace(/`/g, '\\`')}\`` : 'null'}\n`;
      outputContent += '  }' + (index < dailyReadings.length - 1 ? ',' : '') + '\n';
    });
    
    outputContent += '];\n';
    
    fs.writeFileSync(outputPath, outputContent);
    
    // Generate CSS file for styling the HTML content
    const cssPath = path.join(__dirname, 'liturgical-styles.css');
    const cssContent = `/* Liturgical Reading Styles */
.liturgical-intro {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 4px solid #007bff;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.liturgical-intro h3 {
  color: #007bff;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.liturgical-conclusion {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-left: 4px solid #ffc107;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.liturgical-conclusion h4 {
  color: #856404;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.scripture-reference {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-left: 4px solid #28a745;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.scripture-reference h5 {
  color: #155724;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.reference {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #155724;
  background: rgba(255,255,255,0.7);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  margin: 0.1rem;
}

.liturgical-intro p,
.liturgical-conclusion p {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

/* Responsive design */
@media (max-width: 768px) {
  .liturgical-intro,
  .liturgical-conclusion,
  .scripture-reference {
    padding: 0.75rem;
    margin: 0.75rem 0;
  }
  
  .liturgical-intro h3,
  .liturgical-conclusion h4,
  .scripture-reference h5 {
    font-size: 1rem;
  }
}`;
    
    fs.writeFileSync(cssPath, cssContent);
    
    // Generate HTML preview file
    const htmlPath = path.join(__dirname, 'liturgical-preview.html');
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liturgical Readings Preview</title>
    <link rel="stylesheet" href="liturgical-styles.css">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #f8f9fa;
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .sample-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📖 Liturgical Readings Preview</h1>
        <p>Sample of beautified liturgical content with HTML formatting</p>
    </div>
    
    <div class="sample-content">
        <h2>Sample Entries:</h2>`;
    
    // Add sample entries to HTML preview
    dailyReadings.slice(0, 5).forEach((reading, index) => {
      htmlContent += `
        <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Entry ${index + 1} - ${reading.date} (${reading.type})</h3>
            ${reading.content || '<p><em>No content</em></p>'}
        </div>`;
    });
    
    htmlContent += `
    </div>
</body>
</html>`;
    
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log('\n📊 Summary:');
    console.log(`   Total Days: ${totalDays}`);
    console.log(`   Total Raw Entries: ${allRawData.length}`);
    console.log(`   Liturgy Entries: ${dailyReadings.length}`);
    console.log(`   Raw data saved to: ${rawDataPath}`);
    console.log(`   DailyReadings saved to: ${outputPath}`);
    console.log(`   CSS styles saved to: ${cssPath}`);
    console.log(`   HTML preview saved to: ${htmlPath}`);
    
    console.log('\n🔄 DailyReadings.ts Schema Format (first 10 entries):\n');
    console.log('export const dailyReadings = [');
    
    dailyReadings.slice(0, 10).forEach((reading, index) => {
      console.log('  {');
      console.log(`    sortOrder: ${reading.sortOrder},`);
      console.log(`    date: '${reading.date}',`);
      console.log(`    type: '${reading.type}',`);
      console.log(`    references: [${reading.references.map(ref => `'${ref}'`).join(', ')}],`);
      console.log(`    content: ${reading.content ? `'${reading.content.substring(0, 80)}...'` : 'null'}`);
      console.log('  }' + (index < Math.min(10, dailyReadings.length - 1) ? ',' : ''));
    });
    
    if (dailyReadings.length > 10) {
      console.log('  // ... and ' + (dailyReadings.length - 10) + ' more entries');
    }
    
    console.log('];\n');
    
    console.log('📖 Sample Entries (with HTML Beautification):');
    dailyReadings.slice(0, 10).forEach((reading, index) => {
      if (reading.type === 'scripture') {
        console.log(`   ${index + 1}. ${reading.date} - ${reading.type}: ${reading.references.join(', ')}`);
      } else {
        const contentPreview = reading.content ? reading.content.replace(/<[^>]*>/g, '').substring(0, 60) : 'No content';
        console.log(`   ${index + 1}. ${reading.date} - ${reading.type}: ${contentPreview}...`);
      }
    });
    
    if (dailyReadings.length > 10) {
      console.log(`   ... and ${dailyReadings.length - 10} more entries`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Helper function to convert book names to codes
function getBookCode(bookName: string): string {
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

// Extract raw data from Katameros API response
function extractRawData(apiData: any, date: string, apiDate: string): KatamerosRawData[] {
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
                    const bookCode = getBookCode(passage.bookTranslation);
                    const ref = passage.ref.replace(':', '.');
                    const formattedRef = `${bookCode}${ref}`;
                    
                    rawData.push({
                      date: date,
                      apiDate: apiDate,
                      sortOrder: sortOrder++,
                      section: section.title || 'Unknown',
                      subSection: subSection.title || 'Unknown',
                      bookTranslation: passage.bookTranslation,
                      ref: passage.ref,
                      bookCode: bookCode,
                      formattedRef: formattedRef,
                      contentType: 'scripture',
                      content: null
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

// Get command line arguments
const args = process.argv.slice(2);
const startDateArg = args[0];
const endDateArg = args[1];

// Run the combined script
katamerosToDailyReadings(startDateArg, endDateArg); 