const { Router } = require("express");
const controller = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const router = Router();

// Públicas
router.post("/login", controller.login);

// Protegidas (requieren autenticación)
router.get("/me", auth, controller.getMe);

// Solo ADMIN
router.post("/register", auth, authorize(["ADMIN"]), controller.register);
router.get("/users", auth, authorize(["ADMIN"]), controller.getAllUsers);
router.patch("/users/:id/toggle", auth, authorize(["ADMIN"]), controller.toggleUserActive);

module.exports = router;
