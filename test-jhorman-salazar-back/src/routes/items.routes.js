const { Router } = require("express");
const controller = require("../controllers/items.controller");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const router = Router();

// Catalog must be before /:id so Express doesn't treat "catalog" as an id
router.get("/catalog", auth, controller.getCatalog);
router.get("/", auth, authorize(["ADMIN"]), controller.getAll);
router.get("/:id", auth, authorize(["ADMIN"]), controller.getById);
router.post("/", auth, authorize(["ADMIN"]), controller.create);
router.put("/:id", auth, authorize(["ADMIN"]), controller.update);
router.delete("/:id", auth, authorize(["ADMIN"]), controller.remove);

module.exports = router;
