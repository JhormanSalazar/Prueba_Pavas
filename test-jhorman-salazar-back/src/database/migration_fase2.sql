-- =============================================
-- FASE 2: Auditoría de Estados y Seguridad RBAC
-- Mecánica Pavas S.A.S
-- =============================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS mecanica_pavas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mecanica_pavas;

-- =============================================
-- Tabla: users
-- Gestión de usuarios con roles ADMIN / MECANICO
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role        ENUM('ADMIN', 'MECANICO') NOT NULL DEFAULT 'MECANICO',
  active      BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_role  (role)
) ENGINE=InnoDB;

-- =============================================
-- Tabla: work_order_status_history
-- Historial de cambios de estado de órdenes
-- =============================================
CREATE TABLE IF NOT EXISTS work_order_status_history (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  work_order_id       INT          NOT NULL,
  from_status         VARCHAR(30)  NOT NULL,
  to_status           VARCHAR(30)  NOT NULL,
  note                TEXT         NULL,
  changed_by_user_id  INT          NOT NULL,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_history_work_order  (work_order_id),
  INDEX idx_history_changed_by  (changed_by_user_id),
  INDEX idx_history_created_at  (created_at),

  CONSTRAINT fk_history_user
    FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- Seed: Usuario administrador inicial
-- Password: admin123 (bcrypt hash 10 rounds)
-- IMPORTANTE: Cambiar la contraseña en producción
-- =============================================
INSERT INTO users (name, email, password_hash, role)
VALUES ('Administrador', 'admin@mecanicapavas.com',
        '$2b$10$bZdpra6E9GEiL8Som2dQNunnCr/CTImUkLkbFuqNEceje.tCmdSD.',
        'ADMIN')
ON DUPLICATE KEY UPDATE name = name;
