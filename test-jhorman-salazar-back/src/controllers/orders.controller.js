const ordersService = require("../services/orders.service");
const statusHistoryService = require("../services/statusHistory.service");

const getOrders = async (req, res, next) => {
  try {
    const orders = await ordersService.getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await ordersService.findOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const order = await ordersService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const { newStatus, note } = req.body;
    const order = await ordersService.changeOrderStatus(req.params.id, newStatus, req.user, note);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const order = await ordersService.addItemToOrder(req.params.id, req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const getStatusHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const history = await statusHistoryService.getHistoryByOrderId(req.params.id, { page, limit });
    res.json(history);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, getOrderById, createOrder, changeStatus, addItem, getStatusHistory };
