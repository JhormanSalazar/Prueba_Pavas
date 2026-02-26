const motosService = require("../services/motos.service");

const getAll = async (req, res, next) => {
  try {
    const motos = await motosService.getAll();
    res.json(motos);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const moto = await motosService.getById(req.params.id);
    res.json(moto);
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const motos = await motosService.search(q || "");
    res.json(motos);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const moto = await motosService.create(req.body);
    res.status(201).json(moto);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const moto = await motosService.update(req.params.id, req.body);
    res.json(moto);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await motosService.remove(req.params.id);
    res.json({ message: "Moto eliminada correctamente" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, search, create, update, remove };
