const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const router = Router();

// Rate limiter: max 5 login attempts per IP every 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos.",
  },
});

// Públicas
router.post("/login", loginLimiter, controller.login);

// Protegidas (requieren autenticación)
router.get("/me", auth, controller.getMe);

// Solo ADMIN
router.post("/register", auth, authorize(["ADMIN"]), controller.register);
router.get("/users", auth, authorize(["ADMIN"]), controller.getAllUsers);
router.patch("/users/:id/toggle", auth, authorize(["ADMIN"]), controller.toggleUserActive);

module.exports = router;
