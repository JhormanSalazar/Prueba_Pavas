const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "No autorizado: Token no proporcionado o inválido" });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Acceso denegado: Permisos insuficientes" });
    }

    next();
  };
};

module.exports = authorize;
