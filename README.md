# RoyalRent 👑

**Plataforma digital premium para el alquiler de servicios y vehículos de lujo.**

> Proyecto Fin de Ciclo — Desarrollo de Aplicaciones Multiplataforma (DAM)  
> **Autores:** Gonzalo Velasco & Miguel José

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + Vite 8 + React Router 7 + Axios |
| **Backend** | Node.js + Express 5 (API REST) |
| **Base de datos** | MySQL |
| **Autenticación** | JWT + bcrypt |
| **Despliegue** | Vercel |

## Servicios RoyalRent

- 🚗 Coches de Lujo (Ferrari, Lamborghini, Rolls-Royce...)
- ✈️ Jets Privados
- ⛵ Yates & Barcos
- 🚁 Helicópteros
- 🏡 Villas & Mansiones
- 👔 Staff Premium (Chefs, Chóferes, Seguridad)

---

## Estructura del proyecto

```
backend/           → API REST (Express + MySQL)
  server.js        → Punto de entrada con todas las rutas
  schema.sql       → Esquema de la BD con 40 vehículos de prueba
  init_db.js       → Script para crear la base de datos e insertar datos

frontend/          → Aplicación SPA con React
  src/pages/       → Home, Services, Auth, Profile, Cart
  src/context/     → AuthContext (login/registro), CartContext (carrito)
  src/components/  → Navbar, Footer
  public/img/      → Imágenes de vehículos y servicios
```

---

## Cómo ejecutar

### Requisitos

- Node.js v18+
- MySQL (o XAMPP con MySQL activado)

### 1. Backend

```bash
cd backend
npm install
```

Crear archivo `backend/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=royalrent
JWT_SECRET=tu_secreto_aqui
PORT=5000
```

Inicializar la base de datos e iniciar el servidor:

```bash
npm run init-db   # Crea la BD y los datos de prueba
npm start         # Servidor en http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # Dev server en http://localhost:5173
```

### 3. Acceder

Abrir `http://localhost:5173` en el navegador. El frontend se comunica con el backend en `localhost:5000`.

### Producción

```bash
cd frontend
npm run build     # Genera la carpeta frontend/dist/
```

---

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/register` | Registro de usuario |
| POST | `/api/login` | Inicio de sesión (devuelve JWT) |
| GET | `/api/user/profile` | Perfil del usuario (requiere JWT) |
| PUT | `/api/user/profile` | Actualizar perfil (requiere JWT) |
| GET | `/api/items?type=car` | Listar vehículos (filtro opcional) |
| POST | `/api/orders` | Crear pedido (requiere JWT) |
| GET | `/api/orders/history` | Historial de pedidos (requiere JWT) |

---

*© 2025 RoyalRent — Gonzalo Velasco & Miguel José*
