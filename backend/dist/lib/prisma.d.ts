import { PrismaClient } from "../generated/prisma";
declare let prisma: PrismaClient;
declare global {
    var __singlePrisma__: PrismaClient | undefined;
}
export default prisma;
//# sourceMappingURL=prisma.d.ts.map