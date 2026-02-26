const prisma = require("../lib/prisma");

const getAll = async () => {
  return prisma.client.findMany({
    include: { motos: { select: { id: true, placa: true, marca: true, modelo: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getById = async (id) => {
  const client = await prisma.client.findUnique({
    where: { id: Number(id) },
    include: { motos: true },
  });
  if (!client) throw { status: 404, message: "Cliente no encontrado" };
  return client;
};

const create = async ({ name, email, phone }) => {
  if (!name) throw { status: 400, message: "El nombre es requerido" };
  return prisma.client.create({ data: { name, email, phone } });
};

const update = async (id, { name, email, phone }) => {
  const existing = await prisma.client.findUnique({ where: { id: Number(id) } });
  if (!existing) throw { status: 404, message: "Cliente no encontrado" };
  if (!name) throw { status: 400, message: "El nombre es requerido" };
  return prisma.client.update({
    where: { id: Number(id) },
    data: { name, email, phone },
  });
};

const remove = async (id) => {
  const existing = await prisma.client.findUnique({
    where: { id: Number(id) },
    include: { motos: { include: { workOrders: true } } },
  });
  if (!existing) throw { status: 404, message: "Cliente no encontrado" };

  const hasOrders = existing.motos.some((m) => m.workOrders.length > 0);
  if (hasOrders) {
    throw { status: 400, message: "No se puede eliminar: el cliente tiene órdenes asociadas" };
  }

  await prisma.moto.deleteMany({ where: { clientId: Number(id) } });
  return prisma.client.delete({ where: { id: Number(id) } });
};

module.exports = { getAll, getById, create, update, remove };
