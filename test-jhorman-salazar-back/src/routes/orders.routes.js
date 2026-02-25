const { Router } = require("express");
const controller = require("../controllers/orders.controller");

const router = Router();

router.get("/", controller.getOrders);
router.get("/:id", controller.getOrderById);
router.post("/", controller.createOrder);
router.patch("/:id/status", controller.changeStatus);
router.post("/:id/items", controller.addItem);

module.exports = router;