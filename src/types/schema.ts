import gql from 'graphql-tag';

export const typeDefs = gql`
  type Church {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    currentReadingSchedule: ReadingSchedule
  }

  type ReadingSchedule {
    id: ID!
    name: String!
    description: String
    planType: PlanType!
    createdByChurchId: String
    createdAt: String!
    updatedAt: String!
    church: Church
    createdByChurch: Church
    entries: [DailyReadingEntry!]!
    apis: [LiturgicalReadingAPI!]
  }

  type LiturgicalReadingAPI {
    id: ID!
    apiURL: String!
    createdAt: String!
    updatedAt: String!
  }

  type BibleVerse {
    usfm: String!
    reference: String!
    content: String!
  }

  type DailyReadingEntry {
    id: ID!
    sortOrder: Int!
    date: String!
    type: String!
    references: [String!]!
    content: String
    bibleContent: [BibleVerse!]!
    createdAt: String!
    updatedAt: String!
    readingPlan: ReadingSchedule!
  }

  type DailyReading {
    id: ID!
    sortOrder: Int!
    date: String!
    type: String!
    references: [String!]!
    content: String
    bibleContent: [BibleVerse!]!
    readingPlan: ReadingSchedule!
  }

  # New response type for dailyReadingsForChurch
  type DailyReadingsResponse {
    type: String!
    date: String!
    schedule: ReadingSchedule!
    entries: [DailyReadingEntry!]
    message: String
  }

  enum PlanType {
    liturgical
    custom
  }

  enum ContentType {
    scripture
    text
  }

  # Response types for mutations
  type ChurchResponse {
    success: Boolean!
    church: Church
    message: String!
  }

  type ReadingScheduleResponse {
    success: Boolean!
    readingSchedule: ReadingSchedule
    message: String!
  }

  type DayEntriesResponse {
    success: Boolean!
    entries: [DailyReadingEntry!]!
    message: String!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  # Input types for mutations
  input DailyBlockInput {
    sortOrder: Int!
    type: ContentType!
    references: [String!]
    content: String
  }

  input DayInput {
    date: String!
    blocks: [DailyBlockInput!]!
  }

  type Query {
    # Get daily readings for a specific church on a specific date
    dailyReadingsForChurch(
      churchId: ID!
      date: String!
    ): DailyReadingsResponse!
    
    # Get all reading schedules for a church
    readingSchedulesForChurch(churchId: ID!): [ReadingSchedule!]!
    
    # Get all reading schedules
    readingSchedules: [ReadingSchedule!]!
    
    # Get a specific church
    church(id: ID!): Church
    
    # Get all churches
    churches: [Church!]!
  }

  type Mutation {
    # Add a new church
    addChurch(name: String!): ChurchResponse!
    
    # Update church's reading schedule
    updateChurchReadingSchedule(
      churchId: ID!
      readingScheduleId: ID!
    ): ChurchResponse!
    
    # Create a new reading schedule (without entries initially)
    addReadingSchedule(
      name: String!
      description: String
      planType: PlanType!
      createdByChurchId: String
    ): ReadingScheduleResponse!
    
    # Add a single day to an existing reading schedule
    addDayToReadingSchedule(
      readingScheduleId: ID!
      date: String!
      blocks: [DailyBlockInput!]!
    ): DayEntriesResponse!
    
    # Delete a reading schedule
    deleteReadingSchedule(readingScheduleId: ID!): DeleteResponse!
  }
`; 