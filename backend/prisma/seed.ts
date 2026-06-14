import { PrismaClient } from '@prisma/client';
import { seedEditors } from './seeds/editors.seed';
import { seedReporters } from './seeds/reporters.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Run all seed functions in order
    await seedReporters();
    await seedEditors();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    (globalThis as any).process?.exit?.(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });