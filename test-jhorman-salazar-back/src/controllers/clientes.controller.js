const clientesService = require("../services/clientes.service");

const getAll = async (req, res, next) => {
  try {
    const clients = await clientesService.getAll();
    res.json(clients);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const client = await clientesService.getById(req.params.id);
    res.json(client);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const client = await clientesService.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const client = await clientesService.update(req.params.id, req.body);
    res.json(client);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await clientesService.remove(req.params.id);
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
