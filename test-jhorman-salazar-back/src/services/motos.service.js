const prisma = require("../lib/prisma");

const getAll = async () => {
  return prisma.moto.findMany({
    include: { client: { select: { id: true, name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getById = async (id) => {
  const moto = await prisma.moto.findUnique({
    where: { id: Number(id) },
    include: { client: true, workOrders: true },
  });
  if (!moto) throw { status: 404, message: "Moto no encontrada" };
  return moto;
};

const search = async (query) => {
  return prisma.moto.findMany({
    where: {
      placa: { contains: query },
    },
    include: { client: { select: { id: true, name: true, phone: true } } },
    take: 10,
  });
};

const create = async ({ placa, marca, modelo, clientId }) => {
  if (!placa || !marca || !clientId) {
    throw { status: 400, message: "placa, marca y clientId son requeridos" };
  }

  const client = await prisma.client.findUnique({ where: { id: Number(clientId) } });
  if (!client) throw { status: 404, message: "Cliente no encontrado" };

  const existing = await prisma.moto.findUnique({ where: { placa } });
  if (existing) throw { status: 400, message: "Ya existe una moto con esa placa" };

  return prisma.moto.create({
    data: { placa: placa.toUpperCase(), marca, modelo, clientId: Number(clientId) },
    include: { client: { select: { id: true, name: true } } },
  });
};

const update = async (id, { placa, marca, modelo, clientId }) => {
  const existing = await prisma.moto.findUnique({ where: { id: Number(id) } });
  if (!existing) throw { status: 404, message: "Moto no encontrada" };

  if (!placa || !marca || !clientId) {
    throw { status: 400, message: "placa, marca y clientId son requeridos" };
  }

  if (placa !== existing.placa) {
    const duplicate = await prisma.moto.findUnique({ where: { placa } });
    if (duplicate) throw { status: 400, message: "Ya existe otra moto con esa placa" };
  }

  const client = await prisma.client.findUnique({ where: { id: Number(clientId) } });
  if (!client) throw { status: 404, message: "Cliente no encontrado" };

  return prisma.moto.update({
    where: { id: Number(id) },
    data: { placa: placa.toUpperCase(), marca, modelo, clientId: Number(clientId) },
    include: { client: { select: { id: true, name: true } } },
  });
};

const remove = async (id) => {
  const existing = await prisma.moto.findUnique({
    where: { id: Number(id) },
    include: { workOrders: true },
  });
  if (!existing) throw { status: 404, message: "Moto no encontrada" };

  if (existing.workOrders.length > 0) {
    throw { status: 400, message: "No se puede eliminar: la moto tiene órdenes asociadas" };
  }

  return prisma.moto.delete({ where: { id: Number(id) } });
};

module.exports = { getAll, getById, search, create, update, remove };
