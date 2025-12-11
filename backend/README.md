# ORGANIMEDIA Backend v2.0

Sistema de gestión de tareas y calendario personal con arquitectura moderna PERN (PostgreSQL, Express, React, Node.js).

## 🚀 Características

- ✅ **Arquitectura moderna** con módulos ES6
- ✅ **PostgreSQL** como base de datos
- ✅ **Autenticación JWT** con bcrypt
- ✅ **Validación de datos** con express-validator
- ✅ **API RESTful** con Express
- ✅ **Manejo robusto de errores**
- ✅ **Código limpio y documentado**

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- PostgreSQL >= 12
- npm >= 9.0.0

## 🔧 Instalación

1. **Clonar el repositorio e instalar dependencias:**

```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**

Copia el archivo `.env.example` a `.env` y configura tus credenciales:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=organimedia_db
JWT_SECRET=tu_secreto_super_seguro
```

3. **Crear la base de datos en PostgreSQL:**

Abre pgAdmin4 o psql y ejecuta:

```sql
CREATE DATABASE organimedia_db;
```

4. **Ejecutar el script de configuración de base de datos:**

```bash
npm run db:setup
```

O ejecuta manualmente el archivo `database.sql` en pgAdmin4.

## 🏃‍♂️ Ejecutar el Servidor

### Modo desarrollo:

```bash
npm run dev
```

### Modo producción:

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/profile` | Obtener perfil | Sí |
| PUT | `/api/auth/profile` | Actualizar perfil | Sí |
| DELETE | `/api/auth/account` | Eliminar cuenta | Sí |

### Tareas

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Listar tareas | Sí |
| POST | `/api/tasks` | Crear tarea | Sí |
| GET | `/api/tasks/:id` | Obtener tarea | Sí |
| PUT | `/api/tasks/:id` | Actualizar tarea | Sí |
| DELETE | `/api/tasks/:id` | Eliminar tarea | Sí |
| PATCH | `/api/tasks/:id/complete` | Marcar completada | Sí |
| GET | `/api/tasks/pending` | Tareas pendientes | Sí |
| GET | `/api/tasks/today` | Tareas de hoy | Sí |
| GET | `/api/tasks/stats` | Estadísticas | Sí |

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api` | Info de la API |
| GET | `/api/health` | Estado del servidor |

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación. 

### Cómo usar:

1. **Registrarse o iniciar sesión** para obtener un token
2. **Incluir el token en cada request** que requiera autenticación:

```
Authorization: Bearer <tu_token>
```

## 📦 Estructura del Proyecto

```
backend/
├── config/
│   └── config.js          # Configuración centralizada
├── controllers/
│   ├── authController.js  # Lógica de autenticación
│   └── taskController.js  # Lógica de tareas
├── middleware/
│   ├── auth.js           # Middleware de autenticación
│   └── errorHandler.js   # Manejo de errores
├── models/
│   ├── User.js           # Modelo de usuario
│   └── Task.js           # Modelo de tarea
├── routes/
│   ├── authRoutes.js     # Rutas de autenticación
│   └── taskRoutes.js     # Rutas de tareas
├── scripts/
│   └── setupDatabase.js  # Script de setup DB
├── database.js           # Configuración de PostgreSQL
├── database.sql          # Script SQL de creación
├── server.js             # Punto de entrada
├── .env                  # Variables de entorno
└── package.json          # Dependencias

```

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **pg** - Cliente de PostgreSQL para Node.js
- **bcrypt** - Hashing de contraseñas
- **jsonwebtoken** - Generación y verificación de JWT
- **express-validator** - Validación de datos
- **dotenv** - Gestión de variables de entorno
- **cors** - Middleware CORS

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Autenticación con JWT
- ✅ Validación de datos de entrada
- ✅ Protección contra SQL injection (prepared statements)
- ✅ CORS configurado
- ✅ Variables de entorno para secretos

## 📝 Ejemplos de Uso

### Registrar usuario:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "password": "password123",
    "phone": "+34612345678"
  }'
```

### Crear tarea:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "title": "Reunión importante",
    "description": "Discutir el proyecto",
    "task_date": "2025-12-15",
    "priority": "high"
  }'
```

## 🐛 Debugging

Para ver logs detallados en desarrollo, asegúrate de tener:

```env
NODE_ENV=development
```

## 📄 Licencia

MIT

## 👥 Autor

ORGANIMEDIA Team
