import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({ log: ["info"] });
};

// Fixes "Too many database connections opened"
// https://www.timsanteford.com/posts/how-to-fix-too-many-database-connections-opened-in-prisma-with-next-js-hot-reload/
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export default prisma;
