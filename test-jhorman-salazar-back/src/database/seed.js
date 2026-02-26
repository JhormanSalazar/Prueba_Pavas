require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function run() {
  console.log("=== Seed: inicio ===\n");

  // 1. Seed clients
  const clientCount = await prisma.client.count();
  if (clientCount === 0) {
    await prisma.client.createMany({
      data: [
        { name: "Juan Pérez", email: "juan@mail.com", phone: "3001234567" },
        { name: "María Gómez", email: "maria@mail.com", phone: "3009876543" },
      ],
    });
    console.log("[OK] Clientes insertados: Juan Pérez, María Gómez");
  } else {
    console.log("[--] Clientes ya existen, omitido.");
  }

  // 2. Seed motos
  const motoCount = await prisma.moto.count();
  if (motoCount === 0) {
    await prisma.moto.createMany({
      data: [
        { placa: "ABC123", marca: "Yamaha", modelo: "FZ25", clientId: 1 },
        { placa: "XYZ789", marca: "Honda", modelo: "CB190R", clientId: 2 },
      ],
    });
    console.log("[OK] Motos insertadas: ABC123 (Yamaha), XYZ789 (Honda)");
  } else {
    console.log("[--] Motos ya existen, omitido.");
  }

  // 3. Seed admin user
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@taller.com" },
  });
  if (!adminExists) {
    const hash = await bcrypt.hash("admin123", SALT_ROUNDS);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@taller.com",
        passwordHash: hash,
        role: "ADMIN",
      },
    });
    console.log("[OK] Usuario Admin creado: admin@taller.com / admin123");
  } else {
    console.log("[--] Usuario Admin ya existe, omitido.");
  }

  console.log("\n=== Seed: completado ===");
  await prisma.$disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error("Error en seed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
