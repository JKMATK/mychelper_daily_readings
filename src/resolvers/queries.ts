import prisma from '../database/prisma';
import { BibleService } from '../services/bibleService';
import { LiturgicalService } from '../services/liturgicalService';

export const queryResolvers = {
  dailyReadingsForChurch: async (_: any, { churchId, date }: { churchId: string, date: string }) => {
    try {
      // First, get the church and its assigned reading schedule
      const church = await prisma.church.findUnique({
        where: { id: churchId },
        include: {
          currentReadingSchedule: {
            include: {
              apis: true
            }
          }
        }
      });

      if (!church) {
        throw new Error('Church not found');
      }

      if (!church.currentReadingSchedule) {
        throw new Error('Church has no assigned reading schedule');
      }

      const readingSchedule = church.currentReadingSchedule;

      // Handle different plan types
      if (readingSchedule.planType === 'liturgical') {
        // For liturgical plans, fetch from Katameros API
        const liturgicalService = new LiturgicalService();
        
        try {
          const liturgicalReadings = await liturgicalService.fetchLiturgicalReadings(date);
          
          // Fetch Bible content for scripture entries
          const readingsWithBibleContent = await Promise.all(
            liturgicalReadings.map(async (reading) => {
              if (reading.type === 'scripture' && reading.references && reading.references.length > 0) {
                try {
                  // Fetch Bible content for all references in this entry
                  const bibleContent = await liturgicalService.bibleService.getMultipleScriptures(reading.references);
                  
                  return {
                    ...reading,
                    bibleContent: bibleContent
                  };
                } catch (error) {
                  console.error(`Error fetching Bible content for liturgical reading ${reading.references.join(', ')}:`, error);
                  // Return reading without Bible content if there's an error
                  return {
                    ...reading,
                    bibleContent: []
                  };
                }
              } else {
                return {
                  ...reading,
                  bibleContent: []
                };
              }
            })
          );
          
          return {
            type: 'liturgical',
            schedule: readingSchedule,
            entries: readingsWithBibleContent,
            date: date
          };
        } catch (error) {
          console.error('Error fetching liturgical readings:', error);
          throw new Error('Failed to fetch liturgical readings');
        }
      } else {
        // For custom plans, fetch the daily reading entries
        const entries = await prisma.dailyReadingEntry.findMany({
          where: {
            readingPlanId: readingSchedule.id,
            date: new Date(date)
          },
          include: {
            readingPlan: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        });

        // Fetch Bible content for scripture entries
        const bibleService = new BibleService();
        const entriesWithBibleContent = await Promise.all(
          entries.map(async (entry) => {
            if (entry.type === 'scripture' && entry.references && entry.references.length > 0) {
              try {
                // Fetch Bible content for all references in this entry
                const bibleContent = await bibleService.getMultipleScriptures(entry.references);
                
                return {
                  ...entry,
                  bibleContent: bibleContent // Add the Bible content to the entry
                };
              } catch (error) {
                console.error(`Error fetching Bible content for entry ${entry.id}:`, error);
                // Return entry without Bible content if there's an error
                return {
                  ...entry,
                  bibleContent: []
                };
              }
            } else {
              // For non-scripture entries, return as-is
              return {
                ...entry,
                bibleContent: []
              };
            }
          })
        );

        return {
          type: 'custom',
          schedule: readingSchedule,
          entries: entriesWithBibleContent,
          date: date
        };
      }
    } catch (error) {
      console.error('Error fetching daily readings:', error);
      throw new Error('Failed to fetch daily readings');
    }
  },

  readingSchedulesForChurch: async (_: any, { churchId }: { churchId: string }) => {
    try {
      // Get the church and its current reading schedule
      const church = await prisma.church.findUnique({
        where: { id: churchId },
        include: {
          currentReadingSchedule: {
            include: {
              entries: {
                orderBy: {
                  sortOrder: 'asc'
                }
              },
              apis: true
            }
          }
        }
      });

      if (!church) {
        throw new Error('Church not found');
      }

      return church.currentReadingSchedule ? [church.currentReadingSchedule] : [];
    } catch (error) {
      console.error('Error fetching reading schedules:', error);
      throw new Error('Failed to fetch reading schedules');
    }
  },

  readingSchedules: async (_: any) => {
    try {
      // Get all reading schedules
      const readingSchedules = await prisma.readingSchedule.findMany({
        include: {
          entries: {
            orderBy: {
              sortOrder: 'asc'
            }
          },
          apis: true,
          createdByChurch: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return readingSchedules;
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
          currentReadingSchedule: {
            include: {
              entries: {
                orderBy: {
                  sortOrder: 'asc'
                }
              },
              apis: true
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
          currentReadingSchedule: {
            include: {
              entries: {
                orderBy: {
                  sortOrder: 'asc'
                }
              },
              apis: true
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