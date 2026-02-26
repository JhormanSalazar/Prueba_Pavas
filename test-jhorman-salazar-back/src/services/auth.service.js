const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const SALT_ROUNDS = 10;

const register = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    throw { status: 400, message: "name, email y password son requeridos" };
  }

  const validRoles = ["ADMIN", "MECANICO"];
  const userRole = role && validRoles.includes(role) ? role : "MECANICO";

  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    throw { status: 400, message: "El email ya está registrado" };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await db.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, userRole]
  );

  return { id: result.insertId, name, email, role: userRole };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: "email y password son requeridos" };
  }

  const [rows] = await db.query(
    "SELECT id, name, email, password_hash, role, active FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  const user = rows[0];

  if (!user.active) {
    throw { status: 401, message: "Cuenta desactivada" };
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

const getMe = async (userId) => {
  const [rows] = await db.query(
    "SELECT id, name, email, role, active, created_at FROM users WHERE id = ?",
    [userId]
  );

  if (rows.length === 0) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  return rows[0];
};

const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT id, name, email, role, active, created_at FROM users"
  );
  return rows;
};

const toggleUserActive = async (userId) => {
  const [rows] = await db.query("SELECT id, active FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  const newActive = !rows[0].active;
  await db.query("UPDATE users SET active = ? WHERE id = ?", [newActive, userId]);

  return { id: userId, active: newActive };
};

module.exports = { register, login, getMe, getAllUsers, toggleUserActive };
