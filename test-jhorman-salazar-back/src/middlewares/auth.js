const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No autorizado: Token no proporcionado o inválido" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "No autorizado: El token ha expirado"
        : "No autorizado: Token no proporcionado o inválido";

    return res.status(401).json({ error: message });
  }
};

module.exports = auth;
