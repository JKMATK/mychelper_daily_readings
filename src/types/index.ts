import gql from 'graphql-tag';

export const typeDefs = gql`
  type Church {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
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

  enum PlanType {
    liturgical
    custom
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

  type Query {
    # Get daily readings for a specific church on a specific date
    dailyReadingsForChurch(
      churchId: ID!
      date: String!
    ): [DailyReading!]!
    
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