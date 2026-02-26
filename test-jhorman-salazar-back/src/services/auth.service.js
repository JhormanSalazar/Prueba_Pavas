const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const SALT_ROUNDS = 10;

const register = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    throw { status: 400, message: "name, email y password son requeridos" };
  }

  const validRoles = ["ADMIN", "MECANICO"];
  const userRole = role && validRoles.includes(role) ? role : "MECANICO";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw { status: 400, message: "El email ya está registrado" };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: userRole },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: "email y password son requeridos" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, passwordHash: true, role: true, active: true },
  });

  if (!user) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  if (!user.active) {
    throw { status: 401, message: "Cuenta desactivada" };
  }

  const match = await bcrypt.compare(password, user.passwordHash);
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
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });

  if (!user) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  return user;
};

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
};

const toggleUserActive = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true, active: true },
  });

  if (!user) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { active: !user.active },
    select: { id: true, active: true },
  });

  return updated;
};

module.exports = { register, login, getMe, getAllUsers, toggleUserActive };
