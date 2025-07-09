import prisma from '../database/prisma';

export const mutationResolvers = {
  // 1. Add a church
  addChurch: async (_: any, { name }: { name: string }) => {
    try {
      // Create a new church without a reading schedule initially
      const church = await prisma.church.create({
        data: {
          name,
          // Don't set readingScheduleId - let it be null initially
        },
        include: {
          currentReadingSchedule: true
        }
      });

      return {
        success: true,
        church,
        message: 'Church created successfully'
      };
    } catch (error) {
      console.error('Error creating church:', error);
      return {
        success: false,
        church: null,
        message: `Failed to create church: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },

  // 2. Edit church to select reading schedule
  updateChurchReadingSchedule: async (_: any, { 
    churchId, 
    readingScheduleId 
  }: { 
    churchId: string, 
    readingScheduleId: string 
  }) => {
    try {
      // Verify the reading schedule exists
      const readingSchedule = await prisma.readingSchedule.findUnique({
        where: { id: readingScheduleId }
      });

      if (!readingSchedule) {
        return {
          success: false,
          church: null,
          message: 'Reading schedule not found'
        };
      }

      // Update the church's reading schedule
      const church = await prisma.church.update({
        where: { id: churchId },
        data: {
          readingScheduleId
        },
        include: {
          currentReadingSchedule: {
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

      return {
        success: true,
        church,
        message: 'Church reading schedule updated successfully'
      };
    } catch (error) {
      console.error('Error updating church reading schedule:', error);
      return {
        success: false,
        church: null,
        message: 'Failed to update church reading schedule'
      };
    }
  },

  // 3. Add reading schedule by day, each day takes multiple blocks
  addReadingSchedule: async (_: any, { 
    name, 
    description, 
    planType, 
    dailyBlocks 
  }: { 
    name: string, 
    description?: string, 
    planType: 'liturgical' | 'custom',
    dailyBlocks: Array<{
      date: string,
      blocks: Array<{
        sortOrder: number,
        type: 'scripture' | 'text',
        references?: string[],
        content?: string
      }>
    }>
  }) => {
    try {
      // Create the reading schedule
      const readingSchedule = await prisma.readingSchedule.create({
        data: {
          name,
          description,
          planType,
          entries: {
            create: dailyBlocks.flatMap(dayBlock => 
              dayBlock.blocks.map(block => ({
                sortOrder: block.sortOrder,
                date: new Date(dayBlock.date),
                type: block.type,
                references: block.references || [],
                content: block.content
              }))
            )
          }
        },
        include: {
          entries: {
            orderBy: {
              sortOrder: 'asc'
            }
          }
        }
      });

      return {
        success: true,
        readingSchedule,
        message: 'Reading schedule created successfully'
      };
    } catch (error) {
      console.error('Error creating reading schedule:', error);
      return {
        success: false,
        readingSchedule: null,
        message: 'Failed to create reading schedule'
      };
    }
  },

  // 4. Add a single day to an existing reading schedule
  addDayToReadingSchedule: async (_: any, { 
    readingScheduleId, 
    date, 
    blocks 
  }: { 
    readingScheduleId: string, 
    date: string,
    blocks: Array<{
      sortOrder: number,
      type: 'scripture' | 'text',
      references?: string[],
      content?: string
    }>
  }) => {
    try {
      // Verify the reading schedule exists
      const readingSchedule = await prisma.readingSchedule.findUnique({
        where: { id: readingScheduleId }
      });

      if (!readingSchedule) {
        return {
          success: false,
          entries: [],
          message: 'Reading schedule not found'
        };
      }

      // Create entries for the day
      const entries = await prisma.dailyReadingEntry.createMany({
        data: blocks.map(block => ({
          readingPlanId: readingScheduleId,
          sortOrder: block.sortOrder,
          date: new Date(date),
          type: block.type,
          references: block.references || [],
          content: block.content
        }))
      });

      // Fetch the created entries
      const createdEntries = await prisma.dailyReadingEntry.findMany({
        where: {
          readingPlanId: readingScheduleId,
          date: new Date(date)
        },
        orderBy: {
          sortOrder: 'asc'
        }
      });

      return {
        success: true,
        entries: createdEntries,
        message: 'Day added to reading schedule successfully'
      };
    } catch (error) {
      console.error('Error adding day to reading schedule:', error);
      return {
        success: false,
        entries: [],
        message: 'Failed to add day to reading schedule'
      };
    }
  },

  // 5. Delete a reading schedule
  deleteReadingSchedule: async (_: any, { readingScheduleId }: { readingScheduleId: string }) => {
    try {
      // Check if any churches are using this schedule
      const churchesUsingSchedule = await prisma.church.findMany({
        where: { readingScheduleId }
      });

      if (churchesUsingSchedule.length > 0) {
        return {
          success: false,
          message: 'Cannot delete reading schedule that is assigned to churches'
        };
      }

      // Delete the reading schedule (entries will be deleted due to cascade)
      await prisma.readingSchedule.delete({
        where: { id: readingScheduleId }
      });

      return {
        success: true,
        message: 'Reading schedule deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting reading schedule:', error);
      return {
        success: false,
        message: 'Failed to delete reading schedule'
      };
    }
  }
}; 