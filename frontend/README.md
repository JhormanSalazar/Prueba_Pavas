#  Mecánica Pavas  Frontend

Aplicación web SPA para el sistema de gestión de órdenes de trabajo de un taller de motos. Construida con **React 19**, **React Router 7**, **Tailwind CSS 3** y **Axios**.

---

##  Arquitectura

```
frontend/
 public/
    index.html              # HTML base
 src/
    api/                    # Capa de comunicación con el backend
       axiosInstance.js    # Instancia Axios configurada (baseURL, interceptors)
       auth.api.js         # Endpoints de autenticación
       clientes.api.js     # Endpoints de clientes
       estados.api.js      # Endpoints de estados
       items.api.js        # Endpoints de ítems
       motos.api.js        # Endpoints de motos
       orders.api.js       # Endpoints de órdenes
    components/
       Clientes/           # CRUD de clientes (solo ADMIN)
       Estados/            # Vista de estados
       Items/              # CRUD de ítems (solo ADMIN)
       Login/              # Página de inicio de sesión
       Motos/              # CRUD de motos (solo ADMIN)
       OrderDetail/        # Detalle de orden, ítems, acciones de estado, historial
       OrderList/          # Listado y creación de órdenes
       Users/              # Gestión de usuarios (solo ADMIN)
       shared/             # Componentes reutilizables
           AccessDenied.jsx
           PageLoader.jsx
           ProtectedRoute.jsx  # HOC con control de roles
           Sidebar.jsx
           StatusBadge.jsx
    context/
       AuthContext.jsx     # Proveedor de autenticación (React Context)
    hooks/
       useOrders.js        # Custom hook para órdenes
    utils/
       formatters.js       # Formateadores (fechas, moneda, etc.)
    App.js                  # Enrutamiento principal
    App.css
    index.js                # Entry point
    index.css               # Estilos globales + Tailwind directives
 tailwind.config.js
 postcss.config.js
 package.json
```

---

##  Requisitos Previos

| Software   | Versión recomendada |
| ---------- | ------------------- |
| **Node.js** | >= 18.x LTS (recomendado v20+) |
| **npm**     | >= 9.x              |

> El backend debe estar corriendo para que la aplicación funcione correctamente.

---

##  Instalación

```bash
# 1. Ir al directorio del frontend
cd frontend

# 2. Instalar dependencias
npm install
```

---

##  Configuración de la URL Base de la API

La URL del backend se configura en `src/api/axiosInstance.js`:

```javascript
const api = axios.create({
  baseURL: "http://localhost:3001",
});
```

**Si tu backend corre en un puerto o host diferente**, modifica el valor de `baseURL` antes de iniciar.

> **Recomendación para producción:** Usa una variable de entorno con `REACT_APP_API_URL`:
>
> ```javascript
> const api = axios.create({
>   baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
> });
> ```
>
> Y defínela en un archivo `.env`:
> ```dotenv
> REACT_APP_API_URL=https://api.mi-dominio.com
> ```

---

##  Ejecución

### Modo desarrollo

```bash
npm start
```

Inicia el servidor de desarrollo en `http://localhost:3000` con hot reload.

### Modo producción (build)

```bash
npm run build
```

Genera los archivos estáticos optimizados en la carpeta `build/`. Puedes servir esta carpeta con cualquier servidor estático (Nginx, Apache, `serve`, etc.):

```bash
npx serve -s build
```

### Tests

```bash
npm test
```

Ejecuta los tests con Jest y React Testing Library en modo interactivo.

---

##  Rutas de la Aplicación

### Públicas (sin autenticación)

| Ruta      | Componente | Descripción             |
| --------- | ---------- | ----------------------- |
| `/login`  | `Login`    | Inicio de sesión        |

### Protegidas (cualquier usuario autenticado)

| Ruta             | Componente         | Descripción                    |
| ---------------- | ------------------ | ------------------------------ |
| `/`              | `OrderList`        | Listado de órdenes de trabajo  |
| `/orders/new`    | `CreateOrderForm`  | Crear nueva orden              |
| `/orders/:id`    | `OrderDetail`      | Detalle y gestión de una orden |

### Protegidas (solo ADMIN)

| Ruta                          | Componente          | Descripción               |
| ----------------------------- | ------------------- | ------------------------- |
| `/admin/usuarios`             | `UserList`          | Gestión de usuarios       |
| `/admin/usuarios/new`         | `CreateUserForm`    | Crear usuario             |
| `/admin/clientes`             | `ClienteList`       | Gestión de clientes       |
| `/admin/clientes/new`         | `CreateClienteForm` | Crear cliente             |
| `/admin/clientes/:id/edit`    | `EditClienteForm`   | Editar cliente            |
| `/admin/motos`                | `MotoList`          | Gestión de motos          |
| `/admin/motos/new`            | `CreateMotoForm`    | Crear moto                |
| `/admin/motos/:id/edit`       | `EditMotoForm`      | Editar moto               |
| `/admin/items`                | `ItemList`          | Gestión de ítems          |
| `/admin/items/new`            | `CreateItemForm`    | Crear ítem                |
| `/admin/items/:id/edit`       | `EditItemForm`      | Editar ítem               |
| `/admin/estados`              | `EstadoList`        | Vista de estados          |

---

##  Autenticación

El frontend maneja la autenticación mediante:

1. **AuthContext** (`src/context/AuthContext.jsx`): Provee `user`, `token`, `login()` y `logout()` a toda la app.
2. **localStorage**: Almacena `token` y `user` para persistir la sesión entre recargas.
3. **Axios interceptors**:
   - **Request:** Adjunta automáticamente el header `Authorization: Bearer <token>` a cada petición.
   - **Response:** Si el backend responde `401`, limpia la sesión y redirige a `/login`.
4. **ProtectedRoute**: Componente wrapper que verifica autenticación y (opcionalmente) roles antes de renderizar la ruta.

---

##  Dependencias

| Paquete                | Versión  | Propósito                                 |
| ---------------------- | -------- | ----------------------------------------- |
| `react`                | ^19.2.4  | Librería UI                               |
| `react-dom`            | ^19.2.4  | Renderizado DOM                           |
| `react-router-dom`     | ^7.13.1  | Enrutamiento SPA                          |
| `axios`                | ^1.13.5  | Cliente HTTP                              |
| `lucide-react`         | ^0.575.0 | Iconos SVG como componentes React         |
| `react-scripts`        | 5.0.1    | Configuración CRA (Webpack, Babel, etc.)  |
| `tailwindcss` (dev)    | ^3.4.19  | Framework CSS utility-first               |
| `postcss` (dev)        | ^8.5.6   | Procesador CSS (requerido por Tailwind)   |
| `autoprefixer` (dev)   | ^10.4.27 | Prefijos CSS automáticos                  |

---

##  Troubleshooting

### La app muestra pantalla en blanco

- Abre la consola del navegador (F12) y revisa errores.
- Verifica que `npm install` se ejecutó correctamente.
- Confirma que el backend está corriendo en `http://localhost:3001`.

### Error `Network Error` o `ERR_CONNECTION_REFUSED`

El frontend no puede conectar con el backend:
1. Verifica que el backend esté corriendo (`http://localhost:3001/api/health`).
2. Revisa que `baseURL` en `src/api/axiosInstance.js` apunte al host/puerto correcto.
3. Si usas un proxy o firewall, asegúrate de que el puerto `3001` esté abierto.

### Redirección constante a `/login`

- El token JWT puede haber expirado. Inicia sesión de nuevo.
- Si el backend no está disponible, el interceptor de Axios redirige automáticamente a `/login` ante cualquier `401`.

### Los estilos de Tailwind no se aplican

Verifica que `tailwind.config.js` tenga configurado correctamente el `content`:

```bash
npm run build
# Si los estilos aparecen en el build pero no en desarrollo, reinicia el servidor:
npm start
```

### Error al hacer `npm start` en Windows

Si obtienes errores de `EPERM` o permisos, intenta:
```powershell
# Borrar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
npm install
npm start
```