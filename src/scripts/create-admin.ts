const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await hash('admin123', 12); // You can change this password
  const admin = await prisma.user.upsert({
    where: { email: 'admin@projectinsight.com' },
    update: {},
    create: {
      email: 'admin@projectinsight.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 