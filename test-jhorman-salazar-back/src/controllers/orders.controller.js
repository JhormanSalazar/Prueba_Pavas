const ordersService = require("../services/orders.service");
const statusHistoryService = require("../services/statusHistory.service");

const getOrders = (req, res, next) => {
  try {
    res.json(ordersService.getAllOrders());
  } catch (err) {
    next(err);
  }
};

const getOrderById = (req, res, next) => {
  try {
    const order = ordersService.findOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const createOrder = (req, res, next) => {
  try {
    const order = ordersService.createOrder(req.body);
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

const addItem = (req, res, next) => {
  try {
    const order = ordersService.addItemToOrder(req.params.id, req.body);
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
