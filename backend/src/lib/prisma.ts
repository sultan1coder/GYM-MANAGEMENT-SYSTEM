import { PrismaClient } from "../generated/prisma";

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __singlePrisma__: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__singlePrisma__) {
    global.__singlePrisma__ = new PrismaClient();
  }
  prisma = global.__singlePrisma__;
}

export default prisma;
