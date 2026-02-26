# 🔧 Mecánica Pavas — Backend API

API REST para el sistema de gestión de órdenes de trabajo de un taller de motos. Construida con **Node.js**, **Express 5** y **Prisma ORM** sobre **MySQL**.

---

## 📐 Arquitectura

```
test-jhorman-salazar-back/
├── index.js                    # Entry point — configura Express, monta rutas
├── prisma/
│   └── schema.prisma           # Esquema de BD (modelos, enums, relaciones)
└── src/
    ├── constants/
    │   └── orderStates.js      # Estados válidos, transiciones y permisos
    ├── controllers/            # Reciben req/res, delegan a services
    │   ├── auth.controller.js
    │   ├── clientes.controller.js
    │   ├── estados.controller.js
    │   ├── items.controller.js
    │   ├── motos.controller.js
    │   └── orders.controller.js
    ├── database/
    │   ├── schema.sql          # DDL original (referencia)
    │   ├── migration_fase2.sql # Migración adicional
    │   └── seed.js             # Datos iniciales (admin, clientes, motos)
    ├── lib/
    │   └── prisma.js           # Instancia singleton de PrismaClient
    ├── middlewares/
    │   ├── auth.js             # Verificación de JWT
    │   ├── authorize.js        # Control de acceso por roles (RBAC)
    │   └── errorHandler.js     # Middleware global de errores
    ├── routes/                 # Definición de endpoints y middlewares por ruta
    │   ├── auth.routes.js
    │   ├── clientes.routes.js
    │   ├── estados.routes.js
    │   ├── items.routes.js
    │   ├── motos.routes.js
    │   └── orders.routes.js
    └── services/               # Lógica de negocio pura
        ├── auth.service.js
        ├── clientes.service.js
        ├── estados.service.js
        ├── items.service.js
        ├── motos.service.js
        ├── orders.service.js
        └── statusHistory.service.js
```

---

## ⚙️ Requisitos Previos

| Software   | Versión recomendada |
| ---------- | ------------------- |
| **Node.js** | >= 18.x LTS (recomendado v20+) |
| **npm**     | >= 9.x              |
| **MySQL**   | >= 8.0              |

---

## 🚀 Instalación

```bash
# 1. Ir al directorio del backend
cd test-jhorman-salazar-back

# 2. Instalar dependencias
npm install
```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del backend (puedes copiar el ejemplo incluido):

```bash
cp .env.example .env
```

Luego edita `.env` con tus valores:

| Variable        | Requerida | Ejemplo                                         | Descripción                                                                 |
| --------------- | --------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`  | ✅ Sí     | `mysql://root:password@localhost:3306/mecanica_pavas` | URL de conexión a MySQL usada por Prisma                                    |
| `DB_HOST`       | ❌ No     | `localhost`                                     | Host de MySQL (usado en scripts SQL manuales)                               |
| `DB_PORT`       | ❌ No     | `3306`                                          | Puerto de MySQL                                                             |
| `DB_USER`       | ❌ No     | `root`                                          | Usuario de MySQL                                                            |
| `DB_PASSWORD`   | ❌ No     | *(vacío)*                                       | Contraseña de MySQL                                                         |
| `DB_NAME`       | ❌ No     | `mecanica_pavas`                                | Nombre de la base de datos                                                  |
| `JWT_SECRET`    | ✅ Sí     | `mi_clave_super_secreta_de_al_menos_32_chars`   | Clave para firmar tokens JWT. **Mínimo 32 caracteres recomendado.**         |
| `JWT_EXPIRES_IN`| ❌ No     | `60m`                                           | Tiempo de expiración del JWT (por defecto `60m`). Ejemplos: `8h`, `1d`     |
| `PORT`          | ❌ No     | `3001`                                          | Puerto del servidor Express (por defecto `3001`)                            |

### Ejemplo completo de `.env`

```dotenv
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mi_password
DB_NAME=mecanica_pavas

# Prisma
DATABASE_URL="mysql://root:mi_password@localhost:3306/mecanica_pavas"

# JWT
JWT_SECRET=una_clave_secreta_muy_larga_y_segura_de_al_menos_32_caracteres
JWT_EXPIRES_IN=60m

# Servidor
PORT=3001
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Ya está incluido en `.gitignore`.

---

## 🗄️ Prisma — Configuración de Base de Datos

Prisma es el ORM que gestiona el esquema, las migraciones y las consultas a MySQL. A continuación los comandos críticos:

### `npx prisma generate`

```bash
npx prisma generate
```

**¿Qué hace?** Lee `prisma/schema.prisma` y genera el **cliente de Prisma** (`@prisma/client`) tipado en `node_modules/.prisma/client`. Este cliente es el que usa la aplicación para hacer queries.

**¿Cuándo ejecutarlo?**
- Después de `npm install` (la primera vez).
- Cada vez que modifiques `schema.prisma`.

> Si no lo ejecutas, obtendrás el error: `@prisma/client did not initialize yet`.

---

### `npx prisma db push`

```bash
npx prisma db push
```

**¿Qué hace?** Toma el esquema definido en `schema.prisma` y lo sincroniza directamente contra la base de datos MySQL. Crea tablas, columnas, índices y relaciones que falten. **No genera archivos de migración.**

**¿Cuándo ejecutarlo?**
- En la configuración inicial del proyecto.
- Cuando estés en desarrollo y quieras sincronizar cambios rápidamente.

> Requiere que la base de datos `mecanica_pavas` ya exista en MySQL.

---

### `npx prisma migrate dev`

```bash
npx prisma migrate dev --name nombre_de_la_migracion
```

**¿Qué hace?** Compara el esquema con la BD actual, genera un archivo de migración SQL versionado en `prisma/migrations/`, y lo ejecuta. Ideal para **entornos colaborativos y producción** donde el historial de cambios importa.

**¿Cuándo ejecutarlo?**
- Cuando necesites un historial de migraciones (equipos, CI/CD, producción).
- Después de modificar `schema.prisma` y quieras versionar el cambio.

---

### `npx prisma studio`

```bash
npx prisma studio
```

Abre una interfaz visual en el navegador para explorar y editar los datos de la BD. Útil durante desarrollo.

---

## 🌱 Seed (Datos Iniciales)

Poblar la base de datos con datos de prueba:

```bash
npm run seed
```

Esto crea:
- **2 clientes:** Juan Pérez, María Gómez
- **2 motos:** ABC123 (Yamaha FZ25), XYZ789 (Honda CB190R)
- **1 usuario admin:** `admin@taller.com` / `admin123`

> El seed solo inserta datos si las tablas están vacías (es idempotente por tabla).

---

## ▶️ Ejecución

### Modo desarrollo

```bash
npm start
```

El servidor arrancará en `http://localhost:3001`.

**Endpoint de verificación:**

```bash
curl http://localhost:3001/api/health
# Respuesta: { "status": "ok", "timestamp": "..." }
```

### Modo producción

Para producción, se recomienda usar un process manager como **PM2**:

```bash
npm install -g pm2
pm2 start index.js --name "mecanica-api"
pm2 save
```

---

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Ruta                      | Auth | Rol   | Descripción                     |
| ------ | ------------------------- | ---- | ----- | ------------------------------- |
| POST   | `/api/auth/login`         | ❌   | —     | Iniciar sesión (rate limited)   |
| GET    | `/api/auth/me`            | ✅   | Cualquiera | Obtener usuario actual      |
| POST   | `/api/auth/register`      | ✅   | ADMIN | Registrar nuevo usuario         |
| GET    | `/api/auth/users`         | ✅   | ADMIN | Listar todos los usuarios       |
| PATCH  | `/api/auth/users/:id/toggle` | ✅ | ADMIN | Activar/desactivar usuario    |

### Órdenes de Trabajo (`/api/orders`)

| Método | Ruta                          | Auth | Descripción                          |
| ------ | ----------------------------- | ---- | ------------------------------------ |
| GET    | `/api/orders`                 | ✅   | Listar todas las órdenes             |
| GET    | `/api/orders/:id`             | ✅   | Detalle de una orden                 |
| POST   | `/api/orders`                 | ✅   | Crear nueva orden                    |
| PATCH  | `/api/orders/:id/status`      | ✅   | Cambiar estado de una orden          |
| POST   | `/api/orders/:id/items`       | ✅   | Agregar ítem a una orden             |
| GET    | `/api/orders/:id/history`     | ✅   | Historial de cambios de estado       |

### Clientes (`/api/clientes`), Motos (`/api/motos`), Ítems (`/api/items`), Estados (`/api/estados`)

Cada recurso sigue un patrón CRUD estándar. Todos requieren autenticación.

---

## 🔐 Seguridad

| Mecanismo         | Detalle                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| **JWT**           | Tokens firmados con `JWT_SECRET`. Expiración configurable (default: 60 min). Header: `Authorization: Bearer <token>` |
| **Rate Limiting** | Login limitado a **5 intentos / 15 min** por IP                                                      |
| **RBAC**          | Roles `ADMIN` y `MECANICO`. El middleware `authorize([roles])` controla acceso por ruta              |
| **Hashing**       | Contraseñas hasheadas con bcryptjs (10 salt rounds)                                                  |
| **Validación**    | El servidor no arranca sin `JWT_SECRET`; advierte si tiene < 32 caracteres                           |

---

## 🗃️ Modelos de Base de Datos

| Modelo                       | Tabla                         | Descripción                              |
| ---------------------------- | ----------------------------- | ---------------------------------------- |
| `User`                       | `users`                       | Usuarios del sistema (ADMIN / MECANICO)  |
| `Client`                     | `clients`                     | Clientes del taller                      |
| `Moto`                       | `motos`                       | Motos asociadas a un cliente             |
| `WorkOrder`                  | `work_orders`                 | Órdenes de trabajo                       |
| `WorkOrderItem`              | `work_order_items`            | Ítems (mano de obra / repuestos)         |
| `WorkOrderStatusHistory`     | `work_order_status_history`   | Historial de cambios de estado           |

---

## 🐛 Troubleshooting

### `Can't reach database server at localhost:3306`

1. Verifica que MySQL esté corriendo.
2. Revisa `DATABASE_URL` en `.env`: usuario, contraseña, host y puerto deben coincidir con tu instalación.
3. Prueba la conexión manualmente:
   ```bash
   mysql -u root -p -h localhost -P 3306
   ```

### `@prisma/client did not initialize yet`

El cliente de Prisma no fue generado. Ejecuta:

```bash
npx prisma generate
```

### `FATAL: JWT_SECRET no está definido`

Asegúrate de que `.env` existe y contiene `JWT_SECRET`:

```bash
cp .env.example .env
# Edita JWT_SECRET con una clave de al menos 32 caracteres
```

### Error `P1003: Database mecanica_pavas does not exist`

Crea la base de datos manualmente antes de ejecutar Prisma:

```sql
CREATE DATABASE mecanica_pavas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### El seed falla con errores de foreign key

El seed asume IDs autoincrementales comenzando en 1. Ejecuta el seed **solo con tablas vacías**, o limpia la BD primero:

```bash
npx prisma db push --force-reset   # ⚠️ Borra y recrea todas las tablas
npm run seed
```

### `express-rate-limit` bloquea mi IP en desarrollo

El rate limiter del login se aplica por IP. Si haces muchas pruebas, espera 15 minutos o reinicia el servidor.

---

## 📦 Dependencias

| Paquete                | Versión  | Propósito                            |
| ---------------------- | -------- | ------------------------------------ |
| `express`              | ^5.2.1   | Framework HTTP                       |
| `@prisma/client`       | ^6.19.2  | ORM — cliente para queries           |
| `prisma` (dev)         | ^6.19.2  | ORM — CLI y generador                |
| `jsonwebtoken`         | ^9.0.3   | Generación y verificación de JWT     |
| `bcryptjs`             | ^3.0.3   | Hashing de contraseñas               |
| `cors`                 | ^2.8.6   | Habilitar CORS para el frontend      |
| `dotenv`               | ^17.3.1  | Cargar variables de entorno          |
| `express-rate-limit`   | ^8.2.1   | Rate limiting en endpoints           |
