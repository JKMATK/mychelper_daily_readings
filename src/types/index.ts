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
    createdAt: String!
    updatedAt: String!
    church: Church
    entries: [DailyReadingEntry!]!
    apis: [LiturgicalReadingAPI!]
  }

  type LiturgicalReadingAPI {
    id: ID!
    apiURL: String!
    createdAt: String!
    updatedAt: String!
  }

  type DailyReadingEntry {
    id: ID!
    sortOrder: Int!
    date: String!
    type: String!
    references: [String!]!
    content: String
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

  type Query {
    # Get daily readings for a specific church on a specific date
    dailyReadingsForChurch(
      churchId: ID!
      date: String!
    ): DailyReadingsResponse!
    
    # Get all reading schedules for a church
    readingSchedulesForChurch(churchId: ID!): [ReadingSchedule!]!
    
    # Get a specific church
    church(id: ID!): Church
    
    # Get all churches
    churches: [Church!]!
  }
`;

// Export TypeScript types
export * from './graphql';
export * from './bible'; 