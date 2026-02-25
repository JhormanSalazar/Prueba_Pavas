const ordersService = require("../services/orders.service");

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

const changeStatus = (req, res, next) => {
  try {
    const order = ordersService.changeOrderStatus(req.params.id, req.body.newStatus);
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

module.exports = { getOrders, getOrderById, createOrder, changeStatus, addItem };