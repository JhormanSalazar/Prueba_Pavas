const { Router } = require("express");
const controller = require("../controllers/orders.controller");
const auth = require("../middlewares/auth");

const router = Router();

router.get("/", auth, controller.getOrders);
router.get("/:id", auth, controller.getOrderById);
router.post("/", auth, controller.createOrder);
router.patch("/:id/status", auth, controller.changeStatus);
router.post("/:id/items", auth, controller.addItem);
router.get("/:id/history", auth, controller.getStatusHistory);

module.exports = router;
