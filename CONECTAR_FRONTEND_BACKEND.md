# 🎉 Conectar Frontend con Backend

## ✅ Paso 1: Verificar que el Backend está corriendo

Abre una terminal y ejecuta:

```bash
cd C:\dev\pern\proyecto-sujei\ORGANIMEDIA\backend
npm start
```

Deberías ver algo como:

```
============================================================
🚀 ORGANIMEDIA BACKEND v2.0.0
============================================================
📡 Servidor: http://localhost:3000
✅ Conexión a PostgreSQL establecida
```

## ✅ Paso 2: Abrir el Frontend

### Opción Recomendada: Live Server en VS Code

1. **Abre VS Code** en la carpeta del proyecto
2. **Instala Live Server**:
   - Click en el icono de Extensiones (cuadrado con 4 cuadritos)
   - Busca "Live Server"
   - Click en "Install"
3. **Abre index.html**: 
   - `frontend/index.html`
4. **Inicia Live Server**:
   - Click derecho en el archivo → "Open with Live Server"
   - O click en "Go Live" en la barra inferior

El navegador se abrirá automáticamente en `http://localhost:5500`

### Alternativa: http-server

Si tienes Node.js instalado:

```bash
# Instalar http-server (solo una vez)
npm install -g http-server

# Ejecutar desde la carpeta frontend
cd C:\dev\pern\proyecto-sujei\ORGANIMEDIA\frontend
http-server -p 5500 -c-1
```

Abre tu navegador en: `http://localhost:5500`

## ✅ Paso 3: Probar la Aplicación

### Registrar un Usuario

1. En el frontend, verás la pantalla de Login/Registro
2. Click en la pestaña **"Registrarse"**
3. Completa el formulario:
   - **Usuario**: `demo` (o el que quieras)
   - **Contraseña**: `password123` (mínimo 6 caracteres)
   - **Teléfono**: `+34612345678` (formato: números y +)
4. Click en **"Registrarse"**

Si todo funciona, verás:
- ✅ Mensaje de éxito
- ✅ Automáticamente te llevará al calendario
- ✅ Bienvenida en la esquina superior

### Iniciar Sesión

Si ya tienes cuenta:

1. En la pestaña **"Iniciar Sesión"**
2. Ingresa tu usuario y contraseña
3. Click en **"Iniciar Sesión"**

### Crear tu Primera Tarea

1. Click en el botón **"+"** (esquina superior derecha)
2. O click en cualquier día del calendario
3. Completa el formulario:
   - **Título**: "Mi primera tarea"
   - **Descripción**: (opcional)
   - **Fecha**: Selecciona una fecha
   - **Prioridad**: Alta / Media / Baja
4. Click en **"Agregar Tarea"**

### Ver tus Tareas

1. Las tareas aparecen en el calendario como círculos de colores
2. Click en un día para ver sus tareas en el panel lateral
3. Usa los botones:
   - ✓ Para marcar como completada
   - 🗑️ Para eliminar

## 🎯 Resumen de URLs

| Servicio | URL | Estado |
|----------|-----|--------|
| Backend API | `http://localhost:3000/api` | ✅ Debe estar corriendo |
| Health Check | `http://localhost:3000/api/health` | ✅ Verifica conexión |
| Frontend | `http://localhost:5500` | ✅ Abre con Live Server |

## 🔧 Verificar Conexión

### Backend funcionando:
```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "service": "ORGANIMEDIA Backend",
  "database": "connected"
}
```

### Frontend conectado:
1. Abre el frontend en el navegador
2. Abre la consola del navegador (F12)
3. No deberías ver errores de "Failed to fetch" o "CORS"

## 🐛 Problemas Comunes

### ❌ Error: "Failed to fetch"

**Causa**: El backend no está corriendo

**Solución**:
```bash
cd backend
npm start
```

### ❌ Error: CORS

**Causa**: Abriste el HTML directamente en vez de usar un servidor

**Solución**: Usa Live Server o http-server

### ❌ Error: "Sesión expirada"

**Causa**: Token JWT expirado

**Solución**: Cierra sesión y vuelve a iniciar sesión

## ✨ ¡Listo!

Ahora tienes:
- ✅ Backend corriendo en `http://localhost:3000`
- ✅ Frontend corriendo en `http://localhost:5500`
- ✅ Base de datos PostgreSQL conectada
- ✅ Autenticación JWT funcionando
- ✅ CRUD de tareas completo

**¡Disfruta de ORGANIMEDIA!** 🎉
