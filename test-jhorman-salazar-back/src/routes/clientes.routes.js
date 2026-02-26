const { Router } = require("express");
const controller = require("../controllers/clientes.controller");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const router = Router();

router.get("/", auth, authorize(["ADMIN"]), controller.getAll);
router.get("/:id", auth, authorize(["ADMIN"]), controller.getById);
router.post("/", auth, authorize(["ADMIN"]), controller.create);
router.put("/:id", auth, authorize(["ADMIN"]), controller.update);
router.delete("/:id", auth, authorize(["ADMIN"]), controller.remove);

module.exports = router;
