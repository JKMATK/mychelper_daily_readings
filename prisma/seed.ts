import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.dailyReadingEntry.deleteMany();
  await prisma.readingSchedule.deleteMany();
  await prisma.church.deleteMany();

  // Create churches
  const stMarysChurch = await prisma.church.create({
    data: {
      name: "St. Mary's Catholic Church",
    },
  });

  const stJohnsChurch = await prisma.church.create({
    data: {
      name: "St. John's Episcopal Church",
    },
  });

  const graceLutheran = await prisma.church.create({
    data: {
      name: "Grace Lutheran Church",
    },
  });

  console.log('✅ Churches created');

  // Create reading schedules
  const adventSchedule = await prisma.readingSchedule.create({
    data: {
      createdByChurchId: stMarysChurch.id,
      name: "Advent 2024",
      description: "Daily readings for the Advent season leading to Christmas",
      planType: "liturgical",
    },
  });

  const lentSchedule = await prisma.readingSchedule.create({
    data: {
      createdByChurchId: stMarysChurch.id,
      name: "Lent 2024",
      description: "Daily readings for the Lenten season",
      planType: "liturgical",
    },
  });

  const customSchedule = await prisma.readingSchedule.create({
    data: {
      createdByChurchId: stJohnsChurch.id,
      name: "Daily Devotions 2024",
      description: "Custom daily devotional readings",
      planType: "custom",
    },
  });

  console.log('✅ Reading schedules created');

  // Create daily reading entries for St. Mary's Church - January 2025
  const stMarysJanuaryReadings = [
    // January 1, 2025 - Multiple entries
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 1,
      date: new Date('2025-01-01'),
      type: 'text',
      references: [],
      content: 'Welcome to the new year of readings'
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 2,
      date: new Date('2025-01-01'),
      type: 'scripture',
      references: ['JHN1.1'],
      content: null
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 3,
      date: new Date('2025-01-01'),
      type: 'text',
      references: [],
      content: 'In the beginning was the word'
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 4,
      date: new Date('2025-01-01'),
      type: 'text',
      references: [],
      content: 'Let us reflect on this truth today'
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 5,
      date: new Date('2025-01-01'),
      type: 'scripture',
      references: ['JHN1.2'],
      content: null
    },

    // January 2, 2025 - Multiple entries
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 1,
      date: new Date('2025-01-02'),
      type: 'scripture',
      references: ['JHN1.3'],
      content: null
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 2,
      date: new Date('2025-01-02'),
      type: 'text',
      references: [],
      content: 'The word was God!'
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 3,
      date: new Date('2025-01-02'),
      type: 'text',
      references: [],
      content: 'This is a profound truth we must meditate on'
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 4,
      date: new Date('2025-01-02'),
      type: 'scripture',
      references: ['PSA23.1'],
      content: null
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 5,
      date: new Date('2025-01-02'),
      type: 'text',
      references: [],
      content: 'The Lord is my shepherd'
    },

    // January 3, 2025 - Multiple entries
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 1,
      date: new Date('2025-01-03'),
      type: 'text',
      references: [],
      content: 'Today we focus on prayer'
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 2,
      date: new Date('2025-01-03'),
      type: 'scripture',
      references: ['MAT6.9'],
      content: null
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 3,
      date: new Date('2025-01-03'),
      type: 'text',
      references: [],
      content: 'Our Father who art in heaven'
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 4,
      date: new Date('2025-01-03'),
      type: 'text',
      references: [],
      content: 'Let us pray with reverence and humility'
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 5,
      date: new Date('2025-01-03'),
      type: 'scripture',
      references: ['ROM8.28'],
      content: null
    },
    {
      readingPlanId: adventSchedule.id,
      sortOrder: 6,
      date: new Date('2025-01-03'),
      type: 'text',
      references: [],
      content: 'All things work together for good'
    }
  ];

  // Create daily reading entries for St. John's Church - January 2025 (different schedule)
  const stJohnsJanuaryReadings = [
    // January 1, 2025 - Multiple entries
    {
      readingPlanId: customSchedule.id,
      sortOrder: 1,
      date: new Date('2025-01-01'),
      type: 'scripture',
      references: ['GEN1.1'],
      content: null
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 2,
      date: new Date('2025-01-01'),
      type: 'text',
      references: [],
      content: 'In the beginning God created the heavens and the earth'
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 3,
      date: new Date('2025-01-01'),
      type: 'text',
      references: [],
      content: 'Let us marvel at God\'s creative power'
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 4,
      date: new Date('2025-01-01'),
      type: 'scripture',
      references: ['PSA8.1'],
      content: null
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 5,
      date: new Date('2025-01-01'),
      type: 'text',
      references: [],
      content: 'O Lord, our Lord, how majestic is your name'
    },

    // January 2, 2025 - Multiple entries
    {
      readingPlanId: customSchedule.id,
      sortOrder: 1,
      date: new Date('2025-01-02'),
      type: 'text',
      references: [],
      content: 'Today we explore God\'s love'
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 2,
      date: new Date('2025-01-02'),
      type: 'scripture',
      references: ['JHN3.16'],
      content: null
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 3,
      date: new Date('2025-01-02'),
      type: 'text',
      references: [],
      content: 'For God so loved the world'
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 4,
      date: new Date('2025-01-02'),
      type: 'text',
      references: [],
      content: 'This is the greatest love story ever told'
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 5,
      date: new Date('2025-01-02'),
      type: 'scripture',
      references: ['ROM5.8'],
      content: null
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 6,
      date: new Date('2025-01-02'),
      type: 'text',
      references: [],
      content: 'But God proves his love for us'
    }
  ];

  // Create daily reading entries for Advent (St. Mary's Church)
  const adventReadings = [
    // December 1, 2024 - Multiple entries
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 1,
      date: new Date('2024-12-01'),
      type: 'text',
      references: [],
      content: 'Advent begins - a time of waiting and preparation'
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 2,
      date: new Date('2024-12-01'),
      type: 'scripture',
      references: ['MAT24.37-44'],
      content: null
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 3,
      date: new Date('2024-12-01'),
      type: 'text',
      references: [],
      content: 'As it was in the days of Noah, so it will be at the coming of the Son of Man'
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 4,
      date: new Date('2024-12-01'),
      type: 'text',
      references: [],
      content: 'Let us be ready for His coming'
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 5,
      date: new Date('2024-12-01'),
      type: 'scripture',
      references: ['PSA122.1'],
      content: null
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 6,
      date: new Date('2024-12-01'),
      type: 'text',
      references: [],
      content: 'I rejoiced when they said to me, "Let us go to the house of the Lord"'
    },

    // December 2, 2024 - Multiple entries
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 1,
      date: new Date('2024-12-02'),
      type: 'scripture',
      references: ['LUK21.25-28'],
      content: null
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 2,
      date: new Date('2024-12-02'),
      type: 'text',
      references: [],
      content: 'There will be signs in the sun, the moon, and the stars'
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 3,
      date: new Date('2024-12-02'),
      type: 'text',
      references: [],
      content: 'The world will be in turmoil, but we have hope'
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 4,
      date: new Date('2024-12-02'),
      type: 'scripture',
      references: ['PSA25.1'],
      content: null
    },
    {
      readingPlanId: lentSchedule.id,
      sortOrder: 5,
      date: new Date('2024-12-02'),
      type: 'text',
      references: [],
      content: 'To you, O Lord, I lift up my soul'
    }
  ];

  // Create daily reading entries for Lent (St. John's Church)
  const lentReadings = [
    // February 14, 2024 - Multiple entries
    {
      readingPlanId: customSchedule.id,
      sortOrder: 1,
      date: new Date('2024-02-14'),
      type: 'text',
      references: [],
      content: 'Ash Wednesday - a day of repentance'
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 2,
      date: new Date('2024-02-14'),
      type: 'scripture',
      references: ['MAT6.1-6'],
      content: null
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 3,
      date: new Date('2024-02-14'),
      type: 'text',
      references: [],
      content: 'Take care not to perform righteous deeds in order that people may see them'
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 4,
      date: new Date('2024-02-14'),
      type: 'text',
      references: [],
      content: 'Let our acts of piety be done in secret'
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 5,
      date: new Date('2024-02-14'),
      type: 'scripture',
      references: ['PSA51.1'],
      content: null
    },
    {
      readingPlanId: customSchedule.id,
      sortOrder: 6,
      date: new Date('2024-02-14'),
      type: 'text',
      references: [],
      content: 'Have mercy on me, O God, in your goodness'
    }
  ];

  // Insert all readings
  await prisma.dailyReadingEntry.createMany({
    data: [...stMarysJanuaryReadings, ...stJohnsJanuaryReadings, ...adventReadings, ...lentReadings]
  });

  console.log('✅ Daily reading entries created');

  // Display summary
  const churchCount = await prisma.church.count();
  const scheduleCount = await prisma.readingSchedule.count();
  const readingCount = await prisma.dailyReadingEntry.count();

  console.log('\n📊 Seeding Summary:');
  console.log(`   Churches: ${churchCount}`);
  console.log(`   Reading Schedules: ${scheduleCount}`);
  console.log(`   Daily Readings: ${readingCount}`);

  console.log('\n🎯 Sample Data Created:');
  console.log(`   St. Mary's Church ID: ${stMarysChurch.id}`);
  console.log(`   St. John's Church ID: ${stJohnsChurch.id}`);
  console.log(`   Grace Lutheran ID: ${graceLutheran.id}`);

  console.log('\n📅 Sample dates with multiple entries per church:');
  console.log('   St. Mary\'s Church - 2025-01-01: 5 entries (text, scripture, text, text, scripture)');
  console.log('   St. Mary\'s Church - 2025-01-02: 5 entries (scripture, text, text, scripture, text)');
  console.log('   St. Mary\'s Church - 2025-01-03: 6 entries (text, scripture, text, text, scripture, text)');
  console.log('   St. John\'s Church - 2025-01-01: 5 entries (scripture, text, text, scripture, text)');
  console.log('   St. John\'s Church - 2025-01-02: 6 entries (text, scripture, text, text, scripture, text)');
  console.log('   St. Mary\'s Church - 2024-12-01: 6 entries (Advent readings)');
  console.log('   St. Mary\'s Church - 2024-12-02: 5 entries (Advent readings)');
  console.log('   St. John\'s Church - 2024-02-14: 6 entries (Lent readings)');

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 