# Liturgical Readings Integration

This document explains how to set up and use liturgical reading plans in the MyCHelper app, which fetches daily liturgical readings from the Katameros API.

## Overview

Liturgical reading plans automatically fetch daily readings from the Katameros API (https://api.katameros.app/) and integrate them with the Bible service to provide complete liturgical content.

## Features

- **Real-time API Integration**: Always fetches fresh readings from Katameros API
- **Bible Content Integration**: Automatically populates scripture content using the Bible service
- **Liturgy-Only Filtering**: Only processes "Liturgy" sections (excludes Vespers, Matins, etc.)
- **No Database Storage**: Readings are fetched fresh each time for up-to-date content
- **Dynamic Date Support**: Can fetch readings for any date on-demand

## Setup

### 1. Create a Liturgical Reading Schedule

First, create a reading schedule with `planType: 'liturgical'`:

```graphql
mutation CreateLiturgicalSchedule {
  createReadingSchedule(
    input: {
      name: "Coptic Orthodox Liturgical Readings"
      description: "Daily liturgical readings from the Coptic Orthodox tradition"
      planType: LITURGICAL
      createdByChurchId: "your-church-id"
    }
  ) {
    id
    name
    planType
  }
}
```

### 2. Assign to Church

Assign the liturgical schedule to a church:

```graphql
mutation AssignLiturgicalSchedule {
  updateChurch(
    input: {
      id: "your-church-id"
      readingScheduleId: "liturgical-schedule-id"
    }
  ) {
    id
    name
    currentReadingSchedule {
      id
      name
      planType
    }
  }
}
```

## Usage

### Real-time Fetching

When a church has a liturgical reading schedule, the `dailyReadingsForChurch` query will automatically fetch fresh readings from the Katameros API:

```graphql
query GetLiturgicalReadings {
  dailyReadingsForChurch(
    churchId: "your-church-id"
    date: "2025-01-15"
  ) {
    type
    date
    entries {
      sortOrder
      type
      references
      content
      bibleContent {
        book
        chapter
        verse
        text
      }
    }
  }
}
```

### Manual Script Usage

You can also use the Katameros script directly to generate data files for analysis or testing:

```bash
# Generate data for a specific date range
npx tsx src/scripts/katamerosToDailyReadings.ts "2025-01-01" "2025-01-31"
```

## Data Structure

### Liturgical Reading Entry

Each liturgical reading entry follows this structure:

```typescript
{
  sortOrder: number,        // Order within the day (1-20 for Liturgy)
  date: string,            // Date in YYYY-MM-DD format
  type: 'scripture' | 'text', // Content type
  references: string[],    // Scripture references (e.g., ["JHN1.1"])
  content: string | null   // Text content (null for scripture)
}
```

### Content Types

- **introduction**: Liturgical introductions and prayers
- **scripture**: Bible passages (content is null, references populated)
- **conclusion**: Liturgical conclusions and responses

### Scripture References

References are formatted as `BOOK.CHAPTER.VERSE`:
- `JHN1.1` = John 1:1
- `MAT5.1-12` = Matthew 5:1-12
- `PSA23.1-6` = Psalm 23:1-6

## API Integration

### Katameros API

- **Base URL**: `https://api.katameros.app/readings/gregorian/{DD-MM-YYYY}?languageId=2`
- **Date Format**: DD-MM-YYYY (not MM-DD-YYYY)
- **Language**: English (languageId=2)
- **Rate Limiting**: 2-second delay between requests

### Bible Service Integration

Scripture entries automatically fetch Bible content using the Bible service:
- Multiple references per entry are supported
- Content is cached for performance
- Fallback handling for failed requests

## Error Handling

The system includes comprehensive error handling:

- **API Failures**: Retries with exponential backoff
- **Missing Data**: Graceful degradation with empty content
- **Invalid Dates**: Validation and clear error messages
- **Database Errors**: Transaction rollback and cleanup

## Performance Considerations

### Caching Strategy

1. **Real-time Fetching**: Readings are always fetched fresh from the Katameros API
2. **Bible Content**: Scripture content is cached by the Bible service for performance
3. **API Rate Limiting**: 2-second delays between Katameros API requests to be respectful

### Response Time

- Each request fetches data directly from Katameros API
- Bible content is fetched in parallel for scripture entries
- Typical response time: 3-5 seconds depending on API latency

## Troubleshooting

### Common Issues

1. **Date Format Errors**: Ensure dates are in YYYY-MM-DD format
2. **API Timeouts**: Check network connectivity and Katameros API status
3. **Missing Bible Content**: Verify Bible service configuration
4. **Database Errors**: Check database connection and schema

### Debug Information

The scripts provide detailed logging:
- API request/response details
- Data transformation steps
- Database operation results
- Error messages with context

## Examples

### Complete Workflow

1. Create liturgical schedule
2. Assign to church
3. Query daily readings (automatically fetches from API)

```bash
# 1. Create schedule (via GraphQL)
# 2. Assign to church (via GraphQL)
# 3. Query readings (automatically fetches from Katameros API)
```

### Sample Output

```json
{
  "type": "liturgical",
  "date": "2025-01-15",
  "entries": [
    {
      "sortOrder": 1,
      "type": "text",
      "content": "In the name of the Father, and of the Son, and of the Holy Spirit...",
      "references": [],
      "bibleContent": []
    },
    {
      "sortOrder": 2,
      "type": "scripture",
      "content": null,
      "references": ["JHN1.1-5"],
      "bibleContent": [
        {
          "book": "John",
          "chapter": 1,
          "verse": 1,
          "text": "In the beginning was the Word..."
        }
      ]
    }
  ]
}
``` 