// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create a default Admin user
  const adminEmail = 'roopeshftearn@gmail.com';
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Roopesh',
        email: adminEmail,
        role: UserRole.Admin,
        emailVerified: new Date(),
      },
    });
    console.log(`Created admin user with email: ${adminEmail}`);
  } else {
    console.log(`Admin user with email ${adminEmail} already exists.`);
  }
  
  // Create a default regular user
  const userEmail = 'user@example.com';
  let user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: userEmail,
        role: UserRole.User,
        emailVerified: new Date(),
      },
    });
    console.log(`Created user with email: ${userEmail}`);
  } else {
    console.log(`User with email ${userEmail} already exists.`);
  }


  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
