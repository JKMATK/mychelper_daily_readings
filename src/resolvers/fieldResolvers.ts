export const fieldResolvers = {
  // Field resolvers for date formatting
  Church: {
    createdAt: (parent: any) => parent.createdAt.toISOString(),
    updatedAt: (parent: any) => parent.updatedAt.toISOString()
  },

  ReadingSchedule: {
    createdAt: (parent: any) => parent.createdAt.toISOString(),
    updatedAt: (parent: any) => parent.updatedAt.toISOString()
  },

  DailyReadingEntry: {
    date: (parent: any) => parent.date.toISOString().split('T')[0], // Return just the date part
    createdAt: (parent: any) => parent.createdAt.toISOString(),
    updatedAt: (parent: any) => parent.updatedAt.toISOString()
  },

  DailyReading: {
    date: (parent: any) => parent.date.toISOString().split('T')[0], // Return just the date part
    createdAt: (parent: any) => parent.createdAt.toISOString(),
    updatedAt: (parent: any) => parent.updatedAt.toISOString()
  }
}; 