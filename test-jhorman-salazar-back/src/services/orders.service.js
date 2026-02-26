const prisma = require("../lib/prisma");
const { VALID_TRANSITIONS, ORDER_STATES, ITEM_TYPES, MECANICO_ALLOWED_TARGETS } = require("../constants/orderStates");
const statusHistoryService = require("./statusHistory.service");

// ─── Helpers ────────────────────────────────────────────────

const findOrderById = async (id) => {
  const order = await prisma.workOrder.findUnique({
    where: { id: Number(id) },
    include: {
      moto: { select: { placa: true, marca: true } },
      items: { orderBy: { id: "asc" } },
    },
  });

  if (!order) return null;

  const items = order.items.map((i) => ({
    id: i.id,
    type: i.type,
    description: i.description,
    count: Number(i.count),
    unitValue: Number(i.unitValue),
  }));

  const total = items.reduce((acc, i) => acc + i.count * i.unitValue, 0);

  return {
    id: order.id,
    motoId: order.motoId,
    placa: order.moto.placa,
    marca: order.moto.marca,
    faultDescription: order.faultDescription,
    estado: order.estado,
    items,
    total,
  };
};

// ─── Public API ─────────────────────────────────────────────

const getAllOrders = async () => {
  const orders = await prisma.workOrder.findMany({
    include: {
      moto: { select: { placa: true, marca: true } },
      items: { select: { count: true, unitValue: true } },
    },
    orderBy: { id: "desc" },
  });

  return orders.map((wo) => {
    const total = wo.items.reduce(
      (acc, i) => acc + Number(i.count) * Number(i.unitValue),
      0
    );
    return {
      id: wo.id,
      motoId: wo.motoId,
      placa: wo.moto.placa,
      marca: wo.moto.marca,
      faultDescription: wo.faultDescription,
      estado: wo.estado,
      total,
    };
  });
};

const createOrder = async ({ motoId, placa, faultDescription }) => {
  if ((!motoId && !placa) || !faultDescription) {
    throw { status: 400, message: "motoId (o placa) y faultDescription son requeridos" };
  }

  // Buscar moto por id o por placa
  const where = motoId ? { id: Number(motoId) } : { placa };
  const moto = await prisma.moto.findFirst({
    where,
    select: { id: true, placa: true, marca: true },
  });

  if (!moto) throw { status: 404, message: "Moto no encontrada" };

  const order = await prisma.workOrder.create({
    data: {
      motoId: moto.id,
      faultDescription,
      estado: ORDER_STATES.RECIBIDA,
    },
  });

  return {
    id: order.id,
    motoId: moto.id,
    placa: moto.placa,
    marca: moto.marca,
    faultDescription,
    estado: ORDER_STATES.RECIBIDA,
    items: [],
    total: 0,
  };
};

const changeOrderStatus = async (id, newStatus, user, note) => {
  const order = await prisma.workOrder.findUnique({
    where: { id: Number(id) },
    select: { id: true, estado: true },
  });

  if (!order) throw { status: 404, message: "Orden no encontrada" };

  if (!ORDER_STATES[newStatus]) {
    throw { status: 400, message: `Estado inválido: ${newStatus}` };
  }

  // Regla 1: No registrar si from == to
  if (order.estado === newStatus) {
    throw { status: 400, message: "El estado nuevo es igual al actual" };
  }

  // Regla 2: Si la orden está ENTREGADA, solo ADMIN puede revertir
  if (order.estado === ORDER_STATES.ENTREGADA && user.role !== "ADMIN") {
    throw { status: 403, message: "Solo un ADMIN puede modificar una orden ENTREGADA" };
  }

  // Regla 3 y 4: MECANICO solo puede cambiar a DIAGNOSTICO, EN_PROCESO, LISTA
  if (user.role === "MECANICO" && !MECANICO_ALLOWED_TARGETS.includes(newStatus)) {
    throw {
      status: 403,
      message: `Un MECÁNICO no puede cambiar el estado a ${newStatus}`,
    };
  }

  // Validar transición general (excepto ADMIN revirtiendo ENTREGADA)
  if (order.estado !== ORDER_STATES.ENTREGADA) {
    if (!VALID_TRANSITIONS[order.estado].includes(newStatus)) {
      throw {
        status: 400,
        message: `Transición inválida: ${order.estado} → ${newStatus}`,
      };
    }
  }

  const fromStatus = order.estado;

  await prisma.workOrder.update({
    where: { id: Number(id) },
    data: { estado: newStatus },
  });

  // Registrar en historial
  await statusHistoryService.addHistoryEntry({
    workOrderId: id,
    fromStatus,
    toStatus: newStatus,
    note: note || null,
    changedByUserId: user.id,
  });

  return findOrderById(id);
};

const addItemToOrder = async (id, { type, description, count, unitValue }) => {
  const order = await prisma.workOrder.findUnique({
    where: { id: Number(id) },
    select: { id: true },
  });

  if (!order) throw { status: 404, message: "Orden no encontrada" };

  if (!type || !description || count == null || unitValue == null) {
    throw { status: 400, message: "Todos los campos del ítem son requeridos" };
  }

  if (!ITEM_TYPES.includes(type)) {
    throw { status: 400, message: `Tipo inválido. Usa: ${ITEM_TYPES.join(" | ")}` };
  }

  if (parseFloat(count) <= 0 || parseFloat(unitValue) <= 0) {
    throw { status: 400, message: "count y unitValue deben ser mayores a 0" };
  }

  await prisma.workOrderItem.create({
    data: {
      workOrderId: Number(id),
      type,
      description,
      count: parseFloat(count),
      unitValue: parseFloat(unitValue),
    },
  });

  return findOrderById(id);
};

module.exports = { getAllOrders, createOrder, changeOrderStatus, addItemToOrder, findOrderById };
