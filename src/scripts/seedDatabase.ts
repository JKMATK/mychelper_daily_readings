import { PrismaClient } from '@prisma/client';
import { churches, readingSchedules, dailyReadings } from '../data';

const prisma = new PrismaClient();

interface SeedingResult {
  churches: any[];
  schedules: any[];
  readings: any[];
}

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  await prisma.dailyReadingEntry.deleteMany();
  await prisma.readingSchedule.deleteMany();
  await prisma.church.deleteMany();
  
  console.log('✅ Database cleared');
}

async function seedChurches() {
  console.log('⛪ Creating churches...');
  
  const createdChurches = [];
  for (const churchData of churches) {
    const church = await prisma.church.create({
      data: churchData
    });
    createdChurches.push(church);
    console.log(`   Created: ${church.name} (ID: ${church.id})`);
  }
  
  console.log(`✅ Created ${createdChurches.length} churches`);
  return createdChurches;
}

async function seedReadingSchedules(createdChurches: any[]) {
  console.log('📖 Creating reading schedules...');
  
  const createdSchedules = [];
  const churchIds = createdChurches.map(church => church.id);
  
  for (let i = 0; i < readingSchedules.length; i++) {
    const scheduleData = readingSchedules[i];
    const churchId = churchIds[i % churchIds.length]; // Distribute schedules among churches
    
    const schedule = await prisma.readingSchedule.create({
      data: {
        ...scheduleData,
        createdByChurchId: churchId
      }
    });
    
    createdSchedules.push(schedule);
    console.log(`   Created: ${schedule.name} for church ${churchId}`);
  }
  
  console.log(`✅ Created ${createdSchedules.length} reading schedules`);
  return createdSchedules;
}

async function seedDailyReadings(createdSchedules: any[]) {
  console.log('📚 Creating daily readings...');
  
  const createdReadings = [];
  const scheduleIds = createdSchedules.map(schedule => schedule.id);
  
  for (let i = 0; i < dailyReadings.length; i++) {
    const readingData = dailyReadings[i];
    const scheduleId = scheduleIds[i % scheduleIds.length]; // Distribute readings among schedules
    
    const reading = await prisma.dailyReadingEntry.create({
      data: {
        ...readingData,
        readingPlanId: scheduleId,
        date: new Date(readingData.date)
      }
    });
    
    createdReadings.push(reading);
    console.log(`   Created: ${reading.type} reading for ${readingData.date}`);
  }
  
  console.log(`✅ Created ${createdReadings.length} daily readings`);
  return createdReadings;
}

async function displaySummary(result: SeedingResult) {
  console.log('\n📊 Seeding Summary:');
  console.log(`   Churches: ${result.churches.length}`);
  console.log(`   Reading Schedules: ${result.schedules.length}`);
  console.log(`   Daily Readings: ${result.readings.length}`);
  
  console.log('\n🎯 Sample Church IDs for testing:');
  result.churches.forEach((church, index) => {
    console.log(`   ${index + 1}. ${church.name}: ${church.id}`);
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
    
    // Seed data
    const createdChurches = await seedChurches();
    const createdSchedules = await seedReadingSchedules(createdChurches);
    const createdReadings = await seedDailyReadings(createdSchedules);
    
    // Display summary
    await displaySummary({
      churches: createdChurches,
      schedules: createdSchedules,
      readings: createdReadings
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