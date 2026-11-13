# Sistema de Gestión de Turnos para Peluquería — Parcial 2 (Aplicaciones Híbridas)

Aplicación web Full Stack desarrollada con el stack **MERN** (MongoDB, Express, React y Node.js) para la administración de servicios y reserva inteligente de turnos en una peluquería.

## Características Principales

* **Autenticación y Seguridad:** Registro e inicio de sesión con contraseñas encriptadas mediante `bcrypt` y autorización basada en **JSON Web Tokens (JWT)** con diferenciación de roles (`cliente` y `admin`).
* **Catálogo de Servicios:** Visualización pública de prestaciones (nombre, descripción, duración en minutos y precio) y gestión CRUD completa exclusiva para administradores.
* **Sistema de Turnos con Disponibilidad Dinámica:** Cálculo automático de horarios libres dentro de las franjas de atención (`07:00 a 12:00` y `14:00 a 20:00`), descontando los bloques ocupados según la duración exacta de cada servicio para evitar superposiciones.
* **Gestión de Estados:** Los clientes pueden consultar y cancelar sus propios turnos; los administradores visualizan la agenda completa y pueden confirmar, cancelar o eliminar reservas.

## Tecnologías Utilizadas

* **Backend:** Node.js, Express.js, Mongoose (MongoDB Atlas), JSON Web Token (`jsonwebtoken`), `bcrypt`, `dotenv`, `cors`.
* **Frontend:** React.js (Vite), React Router DOM, Context API, Hooks nativos (`useState`, `useEffect`, `useContext`) y `fetch` nativo.

## Estructura del Proyecto

```text
parcial2-peluqueria/
├── backend/                # API REST (Arquitectura en capas: routes, middlewares, controllers, services, models)
├── frontend/               # SPA en React + Vite (components, context, hooks, pages, services, utils)
├── .gitignore
└── README.md
```

## Requisitos Previos

* **Node.js** v18 o superior.
* Una instancia de **MongoDB** (local o MongoDB Atlas).

## Instalación y Puesta en Marcha

Para ejecutar el proyecto en entorno local se deben levantar ambos servidores en terminales separadas.

### 1. Configuración y arranque del Backend

1. Ingresar a la carpeta del servidor e instalar dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Colocar el archivo `.env` en `backend/.env` con las siguientes variables (entregado por separado):
   ```env
   PORT=3000
   MONGO_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_clave_secreta_jwt
   ```
3. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   La API quedará escuchando en `http://localhost:3000`.

### 2. Configuración y arranque del Frontend

1. En otra terminal, ingresar a la carpeta del cliente e instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Colocar el archivo `.env` en `frontend/.env` con la URL base de la API (entregado por separado):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
3. Iniciar el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador la URL local indicada por Vite (por defecto `http://localhost:5173`).

## Acceso y Roles de Usuario

El sistema permite registrar cuentas directamente desde la pantalla `/registro` eligiendo cualquiera de los dos perfiles disponibles para probar todas las funcionalidades:

* **Administrador (`admin`):** Permite crear, editar y eliminar servicios del catálogo, además de visualizar la agenda completa y confirmar, cancelar o eliminar cualquier turno.
* **Cliente (`cliente`):** Permite consultar el catálogo de servicios, reservar turnos según disponibilidad horaria y gestionar o cancelar sus propias reservas.