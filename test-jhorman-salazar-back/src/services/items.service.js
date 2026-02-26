const prisma = require("../lib/prisma");

const getCatalog = async () => {
  const items = await prisma.workOrderItem.findMany({
    select: {
      type: true,
      description: true,
      unitValue: true,
    },
    orderBy: { description: "asc" },
  });

  // Deduplicate by type+description, keeping latest unitValue
  const map = new Map();
  for (const item of items) {
    const key = `${item.type}::${item.description.trim().toLowerCase()}`;
    // Last one wins (already sorted, but we keep the last seen value)
    map.set(key, {
      type: item.type,
      description: item.description,
      unitValue: Number(item.unitValue),
    });
  }

  return Array.from(map.values()).sort((a, b) =>
    a.description.localeCompare(b.description)
  );
};

const getAll = async () => {
  return prisma.workOrderItem.findMany({
    include: { workOrder: { select: { id: true, estado: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getById = async (id) => {
  const item = await prisma.workOrderItem.findUnique({
    where: { id: Number(id) },
    include: { workOrder: true },
  });
  if (!item) throw { status: 404, message: "Ítem no encontrado" };
  return item;
};

const create = async ({ workOrderId, type, description, count, unitValue }) => {
  if (!workOrderId || !type || !description || count == null || unitValue == null) {
    throw { status: 400, message: "workOrderId, type, description, count y unitValue son requeridos" };
  }

  const validTypes = ["MANO_OBRA", "REPUESTO"];
  if (!validTypes.includes(type)) {
    throw { status: 400, message: "type debe ser MANO_OBRA o REPUESTO" };
  }

  const order = await prisma.workOrder.findUnique({ where: { id: Number(workOrderId) } });
  if (!order) throw { status: 404, message: "Orden de trabajo no encontrada" };

  return prisma.workOrderItem.create({
    data: {
      workOrderId: Number(workOrderId),
      type,
      description,
      count: Number(count),
      unitValue: Number(unitValue),
    },
  });
};

const update = async (id, { type, description, count, unitValue }) => {
  const existing = await prisma.workOrderItem.findUnique({ where: { id: Number(id) } });
  if (!existing) throw { status: 404, message: "Ítem no encontrado" };

  if (!type || !description || count == null || unitValue == null) {
    throw { status: 400, message: "type, description, count y unitValue son requeridos" };
  }

  const validTypes = ["MANO_OBRA", "REPUESTO"];
  if (!validTypes.includes(type)) {
    throw { status: 400, message: "type debe ser MANO_OBRA o REPUESTO" };
  }

  return prisma.workOrderItem.update({
    where: { id: Number(id) },
    data: { type, description, count: Number(count), unitValue: Number(unitValue) },
  });
};

const remove = async (id) => {
  const existing = await prisma.workOrderItem.findUnique({ where: { id: Number(id) } });
  if (!existing) throw { status: 404, message: "Ítem no encontrado" };
  return prisma.workOrderItem.delete({ where: { id: Number(id) } });
};

module.exports = { getCatalog, getAll, getById, create, update, remove };
