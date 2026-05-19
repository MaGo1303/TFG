# RoyalRent

<div align="center">
  <br>
  <img src="https://raw.githubusercontent.com/MaGo1303/TFG/main/frontend/public/img/royal_rent_logo.png" alt="RoyalRent" height="80" />
  <br><br>
  <p><strong>Plataforma de Alquiler de Vehículos y Servicios Premium</strong></p>
  <p>
    <sub>Proyecto Fin de Ciclo · DAM 2025</sub>
    <br>
    <sub>Gonzalo Velasco & Miguel José</sub>
  </p>
  <br>
</div>

---

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white" />
</div>

<br>

## Sobre el proyecto

**RoyalRent** es una aplicación web full-stack que centraliza el alquiler de vehículos y servicios premium en una sola plataforma. Los usuarios pueden explorar un catálogo de coches de lujo, yates y helicópteros, gestionar un carrito de compra, registrarse y consultar su historial de reservas.

Diseñada con una estética corporativa oscura y acabados dorados, RoyalRent busca transmitir la exclusividad y el lujo que representa.

## Stack

```
Frontend   →  React 19 · Vite 8 · React Router 7 · Axios
Backend    →  Node.js · Express 5 · JWT · bcrypt
Base de datos →  MySQL
```

## Estructura

```
├── frontend/           # Aplicación React (SPA)
│   ├── src/
│   │   ├── components/ # Navbar, Footer
│   │   ├── pages/      # Home, Services, Auth, Cart, Profile
│   │   ├── context/    # AuthContext, CartContext, hooks
│   │   ├── App.jsx     # Router y providers
│   │   └── main.jsx    # Entry point
│   └── index.html
│
├── backend/            # API REST
│   ├── server.js       # Express server (7 endpoints)
│   ├── schema.sql      # BD + 40 registros de prueba
│   └── init_db.js      # Script de inicialización
```

## Primeros pasos

```bash
# 1. Inicializar la base de datos
cd backend
npm install
npm run init-db

# 2. Iniciar backend (puerto 5000)
npm start

# 3. En otra terminal, iniciar frontend (puerto 5173)
cd frontend
npm install
npm run dev
```

Requiere **Node.js 18+** y **MySQL** corriendo en local.

## API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/register` | — | Registrar usuario |
| POST | `/api/login` | — | Iniciar sesión |
| GET | `/api/user/profile` | ✓ | Obtener perfil |
| PUT | `/api/user/profile` | ✓ | Actualizar perfil |
| GET | `/api/items` | — | Catálogo (filtro por `?type=`) |
| POST | `/api/orders` | ✓ | Realizar pedido |
| GET | `/api/orders/history` | ✓ | Historial de pedidos |

## Documentación

La documentación completa del proyecto se encuentra en [`Documentacion_TFG.pdf`](./Documentacion_TFG.pdf), que incluye:

- Explicación detallada de cada archivo y componente
- Diagramas de flujo (autenticación, carrito, arquitectura)
- Base de datos y modelo entidad-relación
- Decisiones técnicas justificadas

---

<div align="center">
  <br>
  <sub>© 2025 · Gonzalo Velasco & Miguel José · IES · DAM</sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/MaGo1303/TFG/main/frontend/public/img/royal_rent_favicon.jpg" alt="RR" height="28" />
</div>
