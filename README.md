# 🏍️ Mecánica Pavas — Sistema de Gestión de Órdenes de Trabajo

Sistema full-stack para la gestión de órdenes de trabajo de un taller de motos. Permite crear, dar seguimiento y completar órdenes de servicio con control de roles, historial de estados y gestión de clientes, motos e ítems (mano de obra y repuestos).

---

## 📐 Arquitectura del Proyecto

```
Prueba_Pavas/
├── frontend/                # SPA React 19 + Tailwind CSS
│   └── src/
│       ├── api/             # Capa de comunicación HTTP (Axios)
│       ├── components/      # Componentes organizados por dominio
│       ├── context/         # Contexto de autenticación (React Context)
│       ├── hooks/           # Custom hooks
│       └── utils/           # Funciones utilitarias
│
└── test-jhorman-salazar-back/  # API REST Node.js + Express 5
    ├── prisma/              # Schema y migraciones (Prisma ORM)
    └── src/
        ├── constants/       # Constantes de negocio (estados, transiciones)
        ├── controllers/     # Controladores HTTP
        ├── database/        # SQL base y seed de datos
        ├── lib/             # Instancia compartida de Prisma
        ├── middlewares/     # Auth JWT, RBAC, error handler
        ├── routes/          # Definición de rutas Express
        └── services/        # Lógica de negocio
```

### Stack Tecnológico

| Capa        | Tecnología                                       |
| ----------- | ------------------------------------------------ |
| **Frontend** | React 19, React Router 7, Tailwind CSS 3, Axios |
| **Backend**  | Node.js, Express 5, Prisma ORM 6                |
| **Base de datos** | MySQL 8                                     |
| **Autenticación** | JWT (jsonwebtoken) + bcryptjs               |
| **Seguridad**     | Rate Limiting (express-rate-limit), RBAC    |

---

## ⚙️ Requisitos Previos

| Software   | Versión recomendada | Notas                                         |
| ---------- | ------------------- | --------------------------------------------- |
| **Node.js** | >= 18.x LTS        | Se recomienda v20 LTS o superior              |
| **npm**     | >= 9.x             | Incluido con Node.js                          |
| **MySQL**   | >= 8.0             | Debe estar corriendo antes de iniciar el back |

> **Importante:** Asegúrate de tener MySQL corriendo y accesible en `localhost:3306` (o el host/puerto que configures) antes de iniciar el backend.

---

## 🚀 Inicio Rápido (5 minutos)

### 1. Clonar el repositorio

```bash
git clone https://github.com/JhormanSalazar/Prueba_Pavas.git
cd Prueba_Pavas
```

### 2. Configurar y levantar el Backend

```bash
cd test-jhorman-salazar-back
npm install
```

Crear el archivo `.env` (ver [README del backend](test-jhorman-salazar-back/README.md) para detalle):

```bash
cp .env.example .env
# Edita .env con tus credenciales de MySQL y un JWT_SECRET seguro
```

Sincronizar la base de datos y generar el cliente Prisma:

```bash
npx prisma generate
npx prisma db push
```

Poblar datos iniciales (opcional pero recomendado):

```bash
npm run seed
```

Iniciar el servidor:

```bash
npm start
```

El backend estará disponible en `http://localhost:3001`. Verifica con `http://localhost:3001/api/health`.

### 3. Configurar y levantar el Frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

La aplicación se abrirá en `http://localhost:3000`.

### 4. Iniciar sesión

Si ejecutaste el seed, usa las credenciales del administrador:

| Campo      | Valor              |
| ---------- | ------------------ |
| **Email**  | admin@taller.com   |
| **Password** | admin123         |

---

## 🔐 Seguridad

El sistema implementa múltiples capas de seguridad:

- **JWT (JSON Web Tokens):** Tokens con expiración configurable (por defecto 60 min). Se envían en el header `Authorization: Bearer <token>`.
- **Rate Limiting:** El endpoint de login limita a **5 intentos cada 15 minutos** por IP para prevenir ataques de fuerza bruta.
- **RBAC (Control de Acceso Basado en Roles):** Dos roles definidos:
  - `ADMIN` — Acceso total: gestión de usuarios, clientes, motos, ítems y todas las transiciones de estado.
  - `MECANICO` — Acceso limitado: solo puede ver/crear órdenes y transicionar estados a `DIAGNOSTICO`, `EN_PROCESO` y `LISTA`.
- **Validación de JWT_SECRET:** El servidor no arranca si `JWT_SECRET` no está definido, y emite una advertencia si tiene menos de 32 caracteres.

---

## 🔄 Flujo de Estados de una Orden

```
RECIBIDA → DIAGNOSTICO → EN_PROCESO → LISTA → ENTREGADA
    ↓           ↓             ↓          ↓
 CANCELADA   CANCELADA    CANCELADA   CANCELADA
```

> Los estados `ENTREGADA` y `CANCELADA` son terminales (no permiten más transiciones).

---

## 📂 Documentación por módulo

- **Backend:** [test-jhorman-salazar-back/README.md](test-jhorman-salazar-back/README.md)
- **Frontend:** [frontend/README.md](frontend/README.md)

---

## 🐛 Troubleshooting (Solución de Problemas)

### Error: `Can't reach database server at localhost:3306`

- Verifica que MySQL esté corriendo: `sudo systemctl status mysql` (Linux) o revisa los Servicios de Windows.
- Confirma que las credenciales en `DATABASE_URL` del `.env` sean correctas.
- Prueba conectarte manualmente: `mysql -u root -p -h localhost`.

### Error: `@prisma/client did not initialize yet`

Ejecuta la generación del cliente Prisma:

```bash
cd test-jhorman-salazar-back
npx prisma generate
```

### Error: `JWT_SECRET no está definido`

El backend exige que `JWT_SECRET` esté presente en `.env`. Asegúrate de haber creado el archivo:

```bash
cp .env.example .env
```

### El frontend no conecta con el backend

- Verifica que el backend esté corriendo en el puerto `3001`.
- La URL base está hardcodeada en `frontend/src/api/axiosInstance.js` como `http://localhost:3001`. Ajústala si usas otro puerto.

### Error: `P1001: Can't reach database server` al ejecutar `prisma db push`

- Asegúrate de que la base de datos `mecanica_pavas` exista. Créala manualmente si es necesario:
  ```sql
  CREATE DATABASE mecanica_pavas;
  ```

### El seed falla con errores de FK (Foreign Key)

Ejecuta el seed con la base de datos vacía, ya que depende de IDs autoincrementales comenzando en 1.

---

## 📝 Licencia

ISC
