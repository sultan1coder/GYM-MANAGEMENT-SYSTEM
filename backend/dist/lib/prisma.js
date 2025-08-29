"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
let prisma;
if (process.env.NODE_ENV === "production") {
    prisma = new prisma_1.PrismaClient();
}
else {
    if (!global.__singlePrisma__) {
        global.__singlePrisma__ = new prisma_1.PrismaClient();
    }
    prisma = global.__singlePrisma__;
}
exports.default = prisma;
//# sourceMappingURL=prisma.js.map