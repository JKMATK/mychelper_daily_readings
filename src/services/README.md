# BibleService

A dedicated service layer for integrating with the YouVersion Bible API to fetch scripture content.

## Features

- **Single Verse Fetching**: Get individual Bible verses
- **Efficient Verse Range Fetching**: Get multiple verses using optimized chapter endpoint
- **Chapter Fetching**: Get entire chapters with single API call
- **Pagination Support**: Handle very long chapters with automatic pagination
- **Multiple References**: Fetch multiple scripture references in parallel
- **Reference Parsing**: Parse various scripture reference formats
- **Book Name Normalization**: Convert book names to YouVersion abbreviations
- **Content Cleaning**: Automatically clean up API response content
- **Error Handling**: Comprehensive error handling for API failures
- **TypeScript Support**: Full type safety with TypeScript interfaces

## Setup

1. **Environment Variable**: Add your YouVersion API key to your environment:
   ```bash
   export YOUVERSION_API_KEY="your_api_key_here"
   ```

2. **Import the Service**:
   ```typescript
   import { BibleService } from '../services/bibleService';
   ```

## Usage Examples

### Basic Usage

```typescript
const bibleService = new BibleService();

// Fetch a single verse
const verse = await bibleService.getVerse('GEN', 1, 3);
console.log(verse.reference); // "Genesis 1:3"
console.log(verse.content);   // "And God said, Let there be light: and there was light."

// Fetch a range of verses
const verses = await bibleService.getVerseRange('GEN', 1, 1, 3);
console.log(verses.length); // 3
```

### Reference Parsing

```typescript
// Parse and fetch scripture content
const content = await bibleService.getScriptureContent('Genesis 1:3');
const rangeContent = await bibleService.getScriptureContent('Genesis 1:1-3');

// With book context for shorter references
const content = await bibleService.getScriptureContent('1:3', 'Genesis');

// Fetch entire chapter
const chapter = await bibleService.getScriptureContent('Genesis 1');
```

### Multiple References

```typescript
// Fetch multiple scripture references in parallel
const scriptures = await bibleService.getMultipleScriptures([
  'Genesis 1:1',
  'John 3:16',
  'Psalm 23:1'
]);
```

## Supported Reference Formats

- `"Genesis 1:3"` - Full book name
- `"GEN 1:3"` - Book abbreviation
- `"1:3"` - Chapter:verse (requires book context)
- `"Genesis 1:1-3"` - Verse ranges
- `"GEN 1:1-3"` - Abbreviated ranges
- `"GEN1.1-3"` - Compact format (no spaces, dot separator)
- `"Genesis 1"` - Entire chapter
- `"1 Samuel 2"` - Multi-word book names

## API Configuration

The service uses the following configuration:

- **Base URL**: `https://api-dev.youversion.com/v1/bibles`
- **Default Version**: `12` (YouVersion Bible version)
- **Authentication**: Bearer token via `Authorization` header

## Error Handling

The service includes comprehensive error handling:

- **API Errors**: Handles HTTP errors from YouVersion API
- **Invalid References**: Validates scripture reference formats
- **Unknown Books**: Validates book names against supported list
- **Network Errors**: Handles fetch failures gracefully

## TypeScript Interfaces

```typescript
interface BibleVerse {
  usfm: string;      // USFM format reference
  reference: string; // Human-readable reference
  content: string;   // Verse content
}

interface BibleServiceConfig {
  apiKey: string;
  baseUrl: string;
  defaultVersion: number;
}
```

## Testing

Run the test script to verify the service works:

```bash
npx ts-node src/scripts/testBibleService.ts
```

## Integration with GraphQL

The BibleService is designed to integrate seamlessly with your GraphQL resolvers:

```typescript
// In your resolvers
const scriptureResolvers = {
  Scripture: {
    content: async (parent, args, context) => {
      const bibleService = new BibleService();
      const references = parent.references;
      
      const content = await Promise.all(
        references.map(ref => bibleService.getScriptureContent(ref))
      );
      
      return content;
    }
  }
};
``` 