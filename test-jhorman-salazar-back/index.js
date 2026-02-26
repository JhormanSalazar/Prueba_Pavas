require("dotenv").config();

const express = require("express");
const cors = require("cors");
const ordersRouter = require("./src/routes/orders.routes");
const authRouter = require("./src/routes/auth.routes");
const clientesRouter = require("./src/routes/clientes.routes");
const motosRouter = require("./src/routes/motos.routes");
const itemsRouter = require("./src/routes/items.routes");
const estadosRouter = require("./src/routes/estados.routes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/orders", ordersRouter);
app.use("/clientes", clientesRouter);
app.use("/motos", motosRouter);
app.use("/items", itemsRouter);
app.use("/estados", estadosRouter);

// Debe ir al final, después de todas las rutas
app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
