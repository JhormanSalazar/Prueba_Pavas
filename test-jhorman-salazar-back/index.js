require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ============================================================
// DEBUG: Importaciones con try-catch para detectar crashes
// ============================================================
let ordersRouter, authRouter, clientesRouter, motosRouter, itemsRouter, estadosRouter, errorHandler;

try { ordersRouter = require("./src/routes/orders.routes"); console.log("[OK] orders.routes cargado"); }
catch (e) { console.error("[ERROR] al cargar orders.routes:", e.message); }

try { authRouter = require("./src/routes/auth.routes"); console.log("[OK] auth.routes cargado"); }
catch (e) { console.error("[ERROR] al cargar auth.routes:", e.message); }

try { clientesRouter = require("./src/routes/clientes.routes"); console.log("[OK] clientes.routes cargado"); }
catch (e) { console.error("[ERROR] al cargar clientes.routes:", e.message); }

try { motosRouter = require("./src/routes/motos.routes"); console.log("[OK] motos.routes cargado"); }
catch (e) { console.error("[ERROR] al cargar motos.routes:", e.message); }

try { itemsRouter = require("./src/routes/items.routes"); console.log("[OK] items.routes cargado"); }
catch (e) { console.error("[ERROR] al cargar items.routes:", e.message); }

try { estadosRouter = require("./src/routes/estados.routes"); console.log("[OK] estados.routes cargado"); }
catch (e) { console.error("[ERROR] al cargar estados.routes:", e.message); }

try { errorHandler = require("./src/middlewares/errorHandler"); console.log("[OK] errorHandler cargado"); }
catch (e) { console.error("[ERROR] al cargar errorHandler:", e.message); }

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// DEBUG: Log de TODA peticion entrante (antes de cualquier ruta)
// ============================================================
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} (Host: ${req.headers.host})`);
  next();
});

app.use(cors());
app.use(express.json());

// Endpoint de salud (sin auth, sin nada)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Montar rutas solo si se cargaron correctamente
if (authRouter) app.use("/api/auth", authRouter);
if (ordersRouter) app.use("/api/orders", ordersRouter);
if (clientesRouter) app.use("/api/clientes", clientesRouter);
if (motosRouter) app.use("/api/motos", motosRouter);
if (itemsRouter) app.use("/api/items", itemsRouter);
if (estadosRouter) app.use("/api/estados", estadosRouter);

// Debe ir al final, despues de todas las rutas
if (errorHandler) app.use(errorHandler);

// ============================================================
// DEBUG: Imprimir todas las rutas registradas al arrancar
// ============================================================
function printRoutes(app) {
  console.log("\n========================================");
  console.log("  RUTAS REGISTRADAS EN EXPRESS");
  console.log("========================================");

  const router = app._router || app.router;
  if (!router) {
    console.log("[WARN] No se pudo acceder a app._router. Intentando alternativa...");

    // Express 5 alternativa: recorrer el stack del app
    if (app.stack) {
      app.stack.forEach((layer) => {
        console.log(`  Layer: ${layer.name || "anonymous"} - ${layer.route ? layer.route.path : "(middleware)"}`);
      });
    } else {
      console.log("[WARN] No se encontro stack de rutas. Express 5 puede requerir otro metodo.");
      console.log("[INFO] Version de Express:", require("express/package.json").version);
    }
    return;
  }

  router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Ruta directa en app
      const methods = Object.keys(middleware.route.methods).join(", ").toUpperCase();
      console.log(`  ${methods}\t${middleware.route.path}`);
    } else if (middleware.name === "router") {
      // Sub-router montado con app.use(prefix, router)
      const prefix = middleware.regexp
        ? middleware.regexp.source.replace("^\\", "").replace("\\/?(?=\\/|$)", "").replace(/\\\//g, "/")
        : middleware.path || "(unknown prefix)";

      if (middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods).join(", ").toUpperCase();
            console.log(`  ${methods}\t${prefix}${handler.route.path}`);
          }
        });
      } else {
        console.log(`  [Router]\t${prefix} (no sub-routes found in stack)`);
      }
    } else {
      console.log(`  [Middleware]\t${middleware.name || "anonymous"}`);
    }
  });

  console.log("========================================\n");
}

app.listen(PORT, () => {
  console.log(`\nBackend corriendo en puerto ${PORT}`);
  console.log(`Version de Express: ${require("express/package.json").version}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Prueba de salud: http://localhost:${PORT}/api/health`);
  printRoutes(app);
});
