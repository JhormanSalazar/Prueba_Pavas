const estadosService = require("../services/estados.service");

const getAll = async (req, res, next) => {
  try {
    const states = estadosService.getAll();
    res.json(states);
  } catch (err) {
    next(err);
  }
};

const getByName = async (req, res, next) => {
  try {
    const state = estadosService.getByName(req.params.name);
    res.json(state);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getByName };
