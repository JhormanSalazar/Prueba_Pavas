const itemsService = require("../services/items.service");

const getCatalog = async (req, res, next) => {
  try {
    const catalog = await itemsService.getCatalog();
    res.json(catalog);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const items = await itemsService.getAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const item = await itemsService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const item = await itemsService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const item = await itemsService.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await itemsService.remove(req.params.id);
    res.json({ message: "Ítem eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCatalog, getAll, getById, create, update, remove };
