import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  console.log(`✅ User "${username}" created with ID ${user.id}`);
};

const [,, username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: node scripts/createUser.js <username> <password>");
  process.exit(1);
}

createUser(username, password)
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
