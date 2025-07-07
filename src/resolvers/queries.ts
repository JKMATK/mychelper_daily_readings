import prisma from '../database/prisma';

export const queryResolvers = {
  dailyReadingsForChurch: async (_: any, { churchId, date }: { churchId: string, date: string }) => {
    try {
      const entries = await prisma.dailyReadingEntry.findMany({
        where: {
          readingPlan: {
            createdByChurchId: churchId
          },
          date: new Date(date)
        },
        include: {
          readingPlan: {
            include: {
              church: true
            }
          }
        },
        orderBy: {
          sortOrder: 'asc'
        }
      });

      return entries;
    } catch (error) {
      console.error('Error fetching daily readings:', error);
      throw new Error('Failed to fetch daily readings');
    }
  },

  readingSchedulesForChurch: async (_: any, { churchId }: { churchId: string }) => {
    try {
      const schedules = await prisma.readingSchedule.findMany({
        where: {
          createdByChurchId: churchId
        },
        include: {
          church: true,
          entries: {
            orderBy: {
              sortOrder: 'asc'
            }
          }
        }
      });

      return schedules;
    } catch (error) {
      console.error('Error fetching reading schedules:', error);
      throw new Error('Failed to fetch reading schedules');
    }
  },

  church: async (_: any, { id }: { id: string }) => {
    try {
      const church = await prisma.church.findUnique({
        where: { id },
        include: {
          readingSchedules: {
            include: {
              entries: {
                orderBy: {
                  sortOrder: 'asc'
                }
              }
            }
          }
        }
      });

      return church;
    } catch (error) {
      console.error('Error fetching church:', error);
      throw new Error('Failed to fetch church');
    }
  },

  churches: async () => {
    try {
      const churches = await prisma.church.findMany({
        include: {
          readingSchedules: {
            include: {
              entries: {
                orderBy: {
                  sortOrder: 'asc'
                }
              }
            }
          }
        }
      });

      return churches;
    } catch (error) {
      console.error('Error fetching churches:', error);
      throw new Error('Failed to fetch churches');
    }
  }
}; 