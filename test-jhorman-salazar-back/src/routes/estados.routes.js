const { Router } = require("express");
const controller = require("../controllers/estados.controller");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const router = Router();

router.get("/", auth, authorize(["ADMIN"]), controller.getAll);
router.get("/:name", auth, authorize(["ADMIN"]), controller.getByName);

module.exports = router;
