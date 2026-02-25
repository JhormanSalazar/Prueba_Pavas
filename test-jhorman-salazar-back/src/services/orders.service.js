const { orders, motos } = require("../data/store");
const { VALID_TRANSITIONS, ORDER_STATES, ITEM_TYPES } = require("../constants/orderStates");

const findOrderById = (id) => orders.find((o) => o.id === parseInt(id));

const getAllOrders = () => orders;

const createOrder = ({ motoId, placa, faultDescription }) => {
  if ((!motoId && !placa) || !faultDescription) {
    throw { status: 400, message: "motoId (o placa) y faultDescription son requeridos" };
  }

  const moto = motoId 
    ? motos.find((m) => m.id === parseInt(motoId))
    : motos.find((m) => m.placa === placa);
  if (!moto) throw { status: 404, message: "Moto no encontrada" };

  const newOrder = {
    id: orders.length + 1,
    motoId: moto.id,
    placa: moto.placa,
    marca: moto.marca,
    faultDescription,
    estado: ORDER_STATES.RECIBIDA,
    items: [],
    total: 0,
  };

  orders.push(newOrder);
  return newOrder;
};

const changeOrderStatus = (id, newStatus) => {
  const order = findOrderById(id);
  if (!order) throw { status: 404, message: "Orden no encontrada" };

  if (!ORDER_STATES[newStatus]) {
    throw { status: 400, message: `Estado inválido: ${newStatus}` };
  }

  if (!VALID_TRANSITIONS[order.estado].includes(newStatus)) {
    throw {
      status: 400,
      message: `Transición inválida: ${order.estado} → ${newStatus}`,
    };
  }

  order.estado = newStatus;
  return order;
};

const addItemToOrder = (id, { type, description, count, unitValue }) => {
  const order = findOrderById(id);
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

  const newItem = {
    id: order.items.length + 1,
    type,
    description,
    count: parseFloat(count),
    unitValue: parseFloat(unitValue),
  };

  order.items.push(newItem);
  order.total = order.items.reduce((acc, item) => acc + item.count * item.unitValue, 0);

  return order;
};

module.exports = { getAllOrders, createOrder, changeOrderStatus, addItemToOrder, findOrderById };