const { PrismaClient } = require("@prisma/client");

/** @type {PrismaClient} */
let prisma;

if (!prisma) {
  prisma = new PrismaClient();
}

module.exports = prisma;
