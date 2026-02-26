const { ORDER_STATES, VALID_TRANSITIONS, MECANICO_ALLOWED_TARGETS } = require("../constants/orderStates");

const getAll = () => {
  const states = Object.keys(ORDER_STATES).map((key) => ({
    name: key,
    transitions: VALID_TRANSITIONS[key] || [],
    mecanicoAllowed: MECANICO_ALLOWED_TARGETS.includes(key),
  }));
  return states;
};

const getByName = (name) => {
  const upper = name.toUpperCase();
  if (!ORDER_STATES[upper]) {
    throw { status: 404, message: "Estado no encontrado" };
  }
  return {
    name: upper,
    transitions: VALID_TRANSITIONS[upper] || [],
    mecanicoAllowed: MECANICO_ALLOWED_TARGETS.includes(upper),
  };
};

module.exports = { getAll, getByName };
