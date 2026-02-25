const express = require("express");
const cors = require("cors");
const ordersRouter = require("./src/routes/orders.routes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/orders", ordersRouter);

// Debe ir al final, después de todas las rutas
app.use(errorHandler);

app.listen(3001, () => console.log("Backend corriendo en puerto 3001"));