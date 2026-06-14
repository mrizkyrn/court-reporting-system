import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedReporters(): Promise<void> {
  console.log('📝 Seeding reporters...');

  try {
    const count = await prisma.reporter.count();

    if (count === 0) {
      await prisma.reporter.createMany({
        data: [
          {
            name: 'James Anderson',
            city: 'New York',
            available: true,
            ratePerMin: 2000,
          },
          {
            name: 'Olivia Martinez',
            city: 'Los Angeles',
            available: true,
            ratePerMin: 2200,
          },
          {
            name: 'William Johnson',
            city: 'Chicago',
            available: false,
            ratePerMin: 2100,
          },
          {
            name: 'Sophia Brown',
            city: 'Houston',
            available: true,
            ratePerMin: 2500,
          },
          {
            name: 'Benjamin Davis',
            city: 'Phoenix',
            available: true,
            ratePerMin: 2300,
          },
          {
            name: 'Emma Wilson',
            city: 'Philadelphia',
            available: false,
            ratePerMin: 2400,
          },
          {
            name: 'Lucas Moore',
            city: 'San Antonio',
            available: true,
            ratePerMin: 2000,
          },
          {
            name: 'Ava Taylor',
            city: 'San Diego',
            available: true,
            ratePerMin: 2600,
          },
          {
            name: 'Noah Thomas',
            city: 'Dallas',
            available: true,
            ratePerMin: 2200,
          },
          {
            name: 'Mia Jackson',
            city: 'Austin',
            available: false,
            ratePerMin: 2400,
          },
        ],
      });
    }

    console.log('✅ Reporters seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding reporters:', error);
    throw error;
  }
}