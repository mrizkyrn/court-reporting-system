import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedEditors(): Promise<void> {
  console.log('📝 Seeding editors...');

  try {
    const count = await prisma.editor.count();

    if (count === 0) {
      await prisma.editor.createMany({
        data: [
          {
            name: 'Sarah Johnson',
            flatFee: 50000,
          },
          {
            name: 'Michael Thompson',
            flatFee: 55000,
          },
          {
            name: 'Emily Carter',
            flatFee: 60000,
          },
          {
            name: 'David Wilson',
            flatFee: 50000,
          },
          {
            name: 'Jessica Miller',
            flatFee: 65000,
          },
          {
            name: 'Christopher Brown',
            flatFee: 55000,
          },
          {
            name: 'Amanda Davis',
            flatFee: 60000,
          },
          {
            name: 'Daniel Anderson',
            flatFee: 50000,
          },
        ],
      });
    }

    console.log('✅ Editors seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding editors:', error);
    throw error;
  }
}