# Pasos para Completar la Configuración

## 1. Actualizar tu contraseña de PostgreSQL

Edita el archivo `.env` y cambia esta línea:

```env
DB_PASSWORD=tu_password
```

Por tu contraseña real de PostgreSQL (la que usas en pgAdmin4).

## 2. Verificar que la base de datos existe

Abre pgAdmin4 y verifica que existe la base de datos `organimedia_db`. Si no existe, créala:

```sql
CREATE DATABASE organimedia_db;
```

## 3. Ejecutar el setup de la base de datos

Abre una terminal en la carpeta backend y ejecuta:

```bash
npm run db:setup
```

Este comando creará todas las tablas, índices y triggers automáticamente.

## 4. Iniciar el servidor

```bash
# Para desarrollo (con auto-restart)
npm run dev

# O simplemente:
npm start
```

## 5. Verificar que funciona

Abre tu navegador o usa curl:

```
http://localhost:3000/api/health
```

Deberías ver algo como:

```json
{
  "status": "OK",
  "service": "ORGANIMEDIA Backend",
  "version": "2.0.0",
  "database": "connected"
}
```

## 🎉 ¡Listo!

Tu backend está completamente modernizado y listo para usar.

**Próximo paso**: Actualizar el frontend para usar la nueva API con autenticación JWT.
