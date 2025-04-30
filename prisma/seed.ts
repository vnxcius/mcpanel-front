import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("ADMIN_PASSWORD environment variable is not set");
    process.exit(1);
  }

  const user = { password };
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword!;

  await prisma.user.delete({ where: { id: 1 } });
  await prisma.user.create({ data: user });

  console.log("User seeded successfully");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
