# Database Seeding Guide

This guide explains how to seed your database with sample data for testing and development.

## 🚀 Quick Start

### Option 1: Complete Setup (Recommended)
```bash
npm run db:setup
```
This command will:
1. Generate Prisma client
2. Push database schema
3. Seed with sample data

### Option 2: Step by Step
```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push database schema
npx prisma db push

# 3. Seed the database
npm run seed
```

## 📊 Sample Data Created

### Churches (5 churches)
- St. Mary's Catholic Church
- St. John's Episcopal Church
- Grace Lutheran Church
- First Baptist Church
- Holy Trinity Orthodox Church

### Reading Schedules (5 schedules)
- **Advent 2024** (Liturgical)
- **Lent 2024** (Liturgical)
- **Easter 2024** (Liturgical)
- **Daily Devotions 2024** (Custom)
- **Bible Study 2024** (Custom)

### Daily Readings (14 readings)
- **January 2025 readings**: January 1-2, 2025 (scripture + text alternating)
- **Advent readings**: December 1, 2024 (scripture + text)
- **Lent readings**: February 14, 2024 (scripture + text)

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run seed` | Seed database with sample data |
| `npm run db:seed` | Alias for seed command |
| `npm run db:reset` | Reset database and seed |
| `npm run db:setup` | Complete setup (generate + push + seed) |

## 📁 Data Structure

### Data Files Location
```
src/data/
├── churches.ts          # Church data
├── readingSchedules.ts  # Reading schedule data
├── dailyReadings.ts     # Daily reading data
└── index.ts            # Export all data
```

### Seed Script Location
```
src/scripts/
└── seedDatabase.ts     # Main seeding logic
```

## 🎯 Testing with Sample Data

After seeding, you can test the API with these sample church IDs:

```graphql
# Get daily readings for St. Mary's Church on Dec 1, 2024
query GetDailyReadingsForChurch($churchId: ID!, $date: String!) {
  dailyReadingsForChurch(churchId: $churchId, date: $date) {
    id
    sortOrder
    type
    references
    content
    readingPlan {
      name
      church {
        name
      }
    }
  }
}
```

Variables:
```json
{
  "churchId": "church-uuid-from-seed-output",
  "date": "2025-01-01"
}
```

## 📅 Sample Dates with Readings

- **2025-01-01**: 4 entries (scripture + text alternating)
- **2025-01-02**: 2 entries (scripture + text)
- **2024-12-01**: 4 entries (Advent readings - scripture + text)
- **2024-02-14**: 4 entries (Lent readings - scripture + text)

## 🔄 Resetting Data

To clear all data and start fresh:

```bash
npm run db:reset
```

This will:
1. Reset the database schema
2. Clear all existing data
3. Seed with fresh sample data

## 📝 Customizing Sample Data

### Adding New Churches
Edit `src/data/churches.ts`:
```typescript
export const churches = [
  {
    name: "Your Church Name",
  },
  // ... existing churches
];
```

### Adding New Reading Schedules
Edit `src/data/readingSchedules.ts`:
```typescript
export const readingSchedules = [
  {
    name: "Your Schedule Name",
    description: "Description of the schedule",
    planType: "liturgical" as const, // or "custom"
  },
  // ... existing schedules
];
```

### Adding New Daily Readings
Edit `src/data/dailyReadings.ts`:
```typescript
export const dailyReadings = [
  {
    sortOrder: 1,
    date: '2025-01-01',
    type: 'scripture',
    references: ['JHN1.1'],
    content: null
  },
  {
    sortOrder: 2,
    date: '2025-01-01',
    type: 'text',
    references: [],
    content: 'Your text content here...'
  },
  // ... existing readings
];
```

## 🛠️ Development Workflow

1. **Initial Setup**:
   ```bash
   npm run db:setup
   ```

2. **Start Development**:
   ```bash
   npm run dev
   ```

3. **Test Changes**:
   - Modify data files
   - Run `npm run seed` to apply changes
   - Test in GraphQL Playground

4. **Reset When Needed**:
   ```bash
   npm run db:reset
   ```

## 🔍 Troubleshooting

### Common Issues

**Error: "Database connection failed"**
- Ensure PostgreSQL is running
- Check your `.env` file has correct DATABASE_URL
- Run `npx prisma db push` first

**Error: "Tables don't exist"**
- Run `npx prisma generate` and `npx prisma db push`
- Then run `npm run seed`

**Error: "Permission denied"**
- Ensure database user has proper permissions
- Check database connection string

### Debug Mode
To see detailed seeding output, the script already includes comprehensive logging.

## 📈 Performance Notes

- The seed script uses `createMany` for bulk inserts where possible
- Data is distributed evenly across churches and schedules
- The script includes progress indicators and summaries

## 🎉 Success Indicators

When seeding completes successfully, you should see:
- ✅ Database cleared
- ✅ Churches created (with IDs)
- ✅ Reading schedules created
- ✅ Daily readings created
- 📊 Summary with counts
- 🎯 Sample church IDs for testing
- 📅 Sample dates with readings 