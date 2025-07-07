# Daily Readings GraphQL API Usage

## Overview

This GraphQL API provides endpoints to fetch daily readings for churches. The main query you'll use is `dailyReadingsForChurch` which returns all daily readings for a specific church on a specific date.

## API Endpoint

The GraphQL server runs at: `http://localhost:4002/graphql`

## Main Query: Get Daily Readings for a Church

### Query
```graphql
query GetDailyReadingsForChurch($churchId: ID!, $date: String!) {
  dailyReadingsForChurch(churchId: $churchId, date: $date) {
    id
    sortOrder
    date
    type
    references
    content
    mediaUrl
    readingPlan {
      id
      name
      description
      planType
      church {
        id
        name
      }
    }
  }
}
```

### Variables
```json
{
  "churchId": "your-church-uuid-here",
  "date": "2025-01-01"
}
```

### Response Example
```json
{
  "data": {
    "dailyReadingsForChurch": [
      {
        "id": "uuid-1",
        "sortOrder": 1,
        "date": "2025-01-01",
        "type": "scripture",
        "references": ["JHN1.1"],
        "content": null,
        "readingPlan": {
          "id": "plan-uuid",
          "name": "Advent 2024",
          "description": "Daily readings for Advent season",
          "planType": "liturgical",
          "church": {
            "id": "church-uuid",
            "name": "St. Mary's Church"
          }
        }
      },
      {
        "id": "uuid-2",
        "sortOrder": 2,
        "date": "2025-01-01",
        "type": "text",
        "references": [],
        "content": "In the beginning was the word",
        "readingPlan": {
          "id": "plan-uuid",
          "name": "Advent 2024",
          "description": "Daily readings for Advent season",
          "planType": "liturgical",
          "church": {
            "id": "church-uuid",
            "name": "St. Mary's Church"
          }
        }
      }
    ]
  }
}
```

## Other Available Queries

### 1. Get All Reading Schedules for a Church
```graphql
query GetReadingSchedulesForChurch($churchId: ID!) {
  readingSchedulesForChurch(churchId: $churchId) {
    id
    name
    description
    planType
    entries {
      id
      sortOrder
      date
      type
      references
      content
      mediaUrl
    }
  }
}
```

### 2. Get a Specific Church
```graphql
query GetChurch($id: ID!) {
  church(id: $id) {
    id
    name
    readingSchedules {
      id
      name
      description
      planType
      entries {
        id
        sortOrder
        date
        type
        references
        content
        mediaUrl
      }
    }
  }
}
```

### 3. Get All Churches
```graphql
query GetAllChurches {
  churches {
    id
    name
    readingSchedules {
      id
      name
      description
      planType
    }
  }
}
```

## Data Types

### DailyReading
- `id`: Unique identifier
- `sortOrder`: Order of the reading (1, 2, 3, etc.)
- `date`: Date in YYYY-MM-DD format
- `type`: Type of reading ("scripture" or "text")
- `references`: Array of scripture references (e.g., ["JHN1.1"]) - only for scripture type
- `content`: Text content - only for text type
- `readingPlan`: The reading schedule this belongs to

### ReadingSchedule
- `id`: Unique identifier
- `name`: Name of the reading schedule
- `description`: Description of the schedule
- `planType`: Either "liturgical" or "custom"
- `church`: The church this schedule belongs to
- `entries`: Array of daily reading entries

### Church
- `id`: Unique identifier
- `name`: Church name
- `readingSchedules`: Array of reading schedules for this church

## Usage Examples

### JavaScript/TypeScript
```javascript
const query = `
  query GetDailyReadingsForChurch($churchId: ID!, $date: String!) {
    dailyReadingsForChurch(churchId: $churchId, date: $date) {
      id
      sortOrder
      type
      references
      content
      readingPlan {
        name
      }
    }
  }
`;

const variables = {
  churchId: "your-church-uuid",
  date: "2025-01-01"
};

const response = await fetch('http://localhost:4002/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables
  })
});

const data = await response.json();
console.log(data.data.dailyReadingsForChurch);
```

### cURL
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetDailyReadingsForChurch($churchId: ID!, $date: String!) { dailyReadingsForChurch(churchId: $churchId, date: $date) { id sortOrder type references content } }",
    "variables": {
      "churchId": "your-church-uuid",
      "date": "2025-01-01"
    }
  }' \
  http://localhost:4002/graphql
```

## Testing with GraphQL Playground

1. Start the server: `npm run dev`
2. Open your browser to: `http://localhost:4002/graphql`
3. Use the GraphQL Playground to test queries
4. Copy queries from `sample-queries.graphql` file

## Error Handling

The API includes proper error handling and will return meaningful error messages if:
- Church ID doesn't exist
- Date format is invalid
- Database connection fails
- Required fields are missing

## Date Format

Dates should be provided in ISO 8601 format: `YYYY-MM-DD`
- ✅ `2024-01-15`
- ❌ `01/15/2024`
- ❌ `2024-1-15`

## Sample Queries

### 1. Get Daily Readings for a Church on a Specific Date

```graphql
query GetDailyReadings($churchId: ID!, $date: String!) {
  dailyReadingsForChurch(churchId: $churchId, date: $date) {
    id
    date
    entries {
      id
      sortOrder
      type
      references
      content
    }
  }
}
```

**Variables:**
```json
{
  "churchId": "1",
  "date": "2025-01-01"
}
```

**Sample Response:**
```json
{
  "data": {
    "dailyReadingsForChurch": {
      "id": "1",
      "date": "2025-01-01",
      "entries": [
        {
          "id": "1",
          "sortOrder": 1,
          "type": "text",
          "references": [],
          "content": "Welcome to the new year of readings"
        },
        {
          "id": "2",
          "sortOrder": 2,
          "type": "scripture",
          "references": ["JHN1.1"],
          "content": null
        },
        {
          "id": "3",
          "sortOrder": 3,
          "type": "text",
          "references": [],
          "content": "In the beginning was the word"
        },
        {
          "id": "4",
          "sortOrder": 4,
          "type": "text",
          "references": [],
          "content": "Let us reflect on this truth today"
        },
        {
          "id": "5",
          "sortOrder": 5,
          "type": "scripture",
          "references": ["JHN1.2"],
          "content": null
        }
      ]
    }
  }
}
```

### 2. Get All Churches

```graphql
query GetChurches {
  churches {
    id
    name
    readingSchedules {
      id
      name
      description
      planType
    }
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "churches": [
      {
        "id": "1",
        "name": "St. Mary's Catholic Church",
        "readingSchedules": [
          {
            "id": "1",
            "name": "Advent 2024",
            "description": "Daily readings for the Advent season leading to Christmas",
            "planType": "liturgical"
          },
          {
            "id": "2",
            "name": "Lent 2024",
            "description": "Daily readings for the Lenten season",
            "planType": "liturgical"
          }
        ]
      },
      {
        "id": "2",
        "name": "St. John's Episcopal Church",
        "readingSchedules": [
          {
            "id": "3",
            "name": "Daily Devotions 2024",
            "description": "Custom daily devotional readings",
            "planType": "custom"
          }
        ]
      }
    ]
  }
}
```

### 3. Get Daily Readings for Different Churches on Same Date

You can compare readings between churches on the same date:

```graphql
query CompareReadings($date: String!) {
  stMarysReadings: dailyReadingsForChurch(churchId: "1", date: $date) {
    id
    date
    entries {
      sortOrder
      type
      references
      content
    }
  }
  stJohnsReadings: dailyReadingsForChurch(churchId: "2", date: $date) {
    id
    date
    entries {
      sortOrder
      type
      references
      content
    }
  }
}
```

**Variables:**
```json
{
  "date": "2025-01-01"
}
```

## Multiple Entries Per Day

Each day can have multiple entries in any order. Here are some examples:

### Example 1: Text → Scripture → Text → Text → Scripture
```json
{
  "entries": [
    {
      "sortOrder": 1,
      "type": "text",
      "content": "Welcome to the new year of readings"
    },
    {
      "sortOrder": 2,
      "type": "scripture",
      "references": ["JHN1.1"]
    },
    {
      "sortOrder": 3,
      "type": "text",
      "content": "In the beginning was the word"
    },
    {
      "sortOrder": 4,
      "type": "text",
      "content": "Let us reflect on this truth today"
    },
    {
      "sortOrder": 5,
      "type": "scripture",
      "references": ["JHN1.2"]
    }
  ]
}
```

### Example 2: Scripture → Text → Text → Scripture → Text
```json
{
  "entries": [
    {
      "sortOrder": 1,
      "type": "scripture",
      "references": ["GEN1.1"]
    },
    {
      "sortOrder": 2,
      "type": "text",
      "content": "In the beginning God created the heavens and the earth"
    },
    {
      "sortOrder": 3,
      "type": "text",
      "content": "Let us marvel at God's creative power"
    },
    {
      "sortOrder": 4,
      "type": "scripture",
      "references": ["PSA8.1"]
    },
    {
      "sortOrder": 5,
      "type": "text",
      "content": "O Lord, our Lord, how majestic is your name"
    }
  ]
}
```

## Entry Types

### Scripture Entries
- `type`: "scripture"
- `references`: Array of scripture references (e.g., ["JHN1.1", "PSA23.1"])
- `content`: null

### Text Entries
- `type`: "text"
- `references`: Empty array []
- `content`: The devotional text content

## Testing with cURL

```bash
# Get daily readings for St. Mary's Church on January 1, 2025
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetDailyReadings($churchId: ID!, $date: String!) { dailyReadingsForChurch(churchId: $churchId, date: $date) { id date entries { id sortOrder type references content } } }",
    "variables": {
      "churchId": "1",
      "date": "2025-01-01"
    }
  }' \
  http://localhost:4000/graphql
```

## Available Sample Data

After running the seed script, you'll have:

- **St. Mary's Catholic Church** (ID: 1)
  - 2025-01-01: 5 entries (text, scripture, text, text, scripture)
  - 2025-01-02: 5 entries (scripture, text, text, scripture, text)
  - 2025-01-03: 6 entries (text, scripture, text, text, scripture, text)
  - 2024-12-01: 6 entries (Advent readings)
  - 2024-12-02: 5 entries (Advent readings)

- **St. John's Episcopal Church** (ID: 2)
  - 2025-01-01: 5 entries (scripture, text, text, scripture, text)
  - 2025-01-02: 6 entries (text, scripture, text, text, scripture, text)
  - 2024-02-14: 6 entries (Lent readings)

- **Grace Lutheran Church** (ID: 3)
  - No reading schedules (for testing empty results) 