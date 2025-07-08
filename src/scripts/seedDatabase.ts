import { PrismaClient } from '@prisma/client';
import { churches, readingSchedules, dailyReadings, liturgicalAPIs } from '../data';

const prisma = new PrismaClient();

interface SeedingResult {
  churches: any[];
  schedules: any[];
  readings: any[];
  liturgicalAPIs: any[];
}

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  await prisma.liturgicalReadingAPIs.deleteMany();
  await prisma.dailyReadingEntry.deleteMany();
  await prisma.readingSchedule.deleteMany();
  await prisma.church.deleteMany();
  
  console.log('✅ Database cleared');
}

async function seedChurches(createdSchedules: any[]) {
  console.log('⛪ Creating churches...');
  
  const createdChurches = [];
  const liturgicalSchedule = createdSchedules.find(s => s.planType === 'liturgical');
  const customSchedule = createdSchedules.find(s => s.planType === 'custom');
  
  for (let i = 0; i < churches.length; i++) {
    const churchData = churches[i];
    // First 2 churches use liturgical schedule, rest use custom
    const scheduleId = i < 2 ? liturgicalSchedule.id : customSchedule.id;
    
    const church = await prisma.church.create({
      data: {
        ...churchData,
        readingScheduleId: scheduleId
      }
    });
    createdChurches.push(church);
    console.log(`   Created: ${church.name} (ID: ${church.id})`);
  }
  
  console.log(`✅ Created ${createdChurches.length} churches`);
  return createdChurches;
}

async function seedReadingSchedules() {
  console.log('📖 Creating reading schedules...');
  
  const createdSchedules = [];
  
  for (const scheduleData of readingSchedules) {
    // Create schedules as admin-created (no church association)
    const schedule = await prisma.readingSchedule.create({
      data: {
        ...scheduleData,
        createdByChurchId: null // Admin-created schedules
      }
    });
    
    createdSchedules.push(schedule);
    console.log(`   Created: ${schedule.name} (${schedule.planType})`);
  }
  
  console.log(`✅ Created ${createdSchedules.length} reading schedules`);
  return createdSchedules;
}

async function seedLiturgicalAPIs(createdSchedules: any[]) {
  console.log('🔗 Creating liturgical API configurations...');
  
  const createdAPIs = [];
  const liturgicalSchedule = createdSchedules.find(s => s.planType === 'liturgical');
  
  if (liturgicalSchedule) {
    for (const apiData of liturgicalAPIs) {
      const api = await prisma.liturgicalReadingAPIs.create({
        data: {
          ...apiData,
          readingPlanId: liturgicalSchedule.id
        }
      });
      
      createdAPIs.push(api);
      console.log(`   Created: ${api.apiURL}`);
    }
  }
  
  console.log(`✅ Created ${createdAPIs.length} liturgical API configurations`);
  return createdAPIs;
}

async function seedDailyReadings(createdSchedules: any[]) {
  console.log('📚 Creating daily readings...');
  
  const createdReadings = [];
  const customSchedule = createdSchedules.find(s => s.planType === 'custom');
  
  if (customSchedule) {
    for (const readingData of dailyReadings) {
      const reading = await prisma.dailyReadingEntry.create({
        data: {
          ...readingData,
          type: readingData.type as any,
          readingPlan: { connect: { id: customSchedule.id } },
          date: new Date(readingData.date)
        }
      });
      
      createdReadings.push(reading);
      console.log(`   Created: ${reading.type} reading for ${readingData.date}`);
    }
  }
  
  console.log(`✅ Created ${createdReadings.length} daily readings`);
  return createdReadings;
}

async function displaySummary(result: SeedingResult) {
  console.log('\n📊 Seeding Summary:');
  console.log(`   Churches: ${result.churches.length}`);
  console.log(`   Reading Schedules: ${result.schedules.length}`);
  console.log(`   Daily Readings: ${result.readings.length}`);
  console.log(`   Liturgical APIs: ${result.liturgicalAPIs.length}`);
  
  console.log('\n🎯 Church Assignments:');
  result.churches.forEach((church, index) => {
    const scheduleType = index < 2 ? 'Liturgical' : 'Custom';
    console.log(`   ${index + 1}. ${church.name}: ${scheduleType} Schedule`);
  });
  
  console.log('\n📅 Sample dates with readings:');
  const uniqueDates = [...new Set(dailyReadings.map(reading => reading.date))];
  uniqueDates.slice(0, 5).forEach(date => {
    console.log(`   - ${date}`);
  });
  
  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Start the server: npm run dev');
  console.log('   2. Open GraphQL Playground: http://localhost:4002/graphql');
  console.log('   3. Test with sample queries from sample-queries.graphql');
}

async function main() {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    // Clear existing data
    await clearDatabase();
    
    // Seed data in correct order
    const createdSchedules = await seedReadingSchedules();
    const createdAPIs = await seedLiturgicalAPIs(createdSchedules);
    const createdReadings = await seedDailyReadings(createdSchedules);
    const createdChurches = await seedChurches(createdSchedules);
    
    // Display summary
    await displaySummary({
      churches: createdChurches,
      schedules: createdSchedules,
      readings: createdReadings,
      liturgicalAPIs: createdAPIs
    });
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 