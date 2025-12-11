# ORGANIMEDIA Frontend

Frontend moderno para el sistema de gestión de tareas ORGANIMEDIA.

## 🚀 Características

- ✅ **Autenticación JWT** - Login y registro seguro
- ✅ **Calendario Interactivo** - Vista mensual con tareas
- ✅ **Gestión de Tareas** - Crear, editar, completar y eliminar
- ✅ **Prioridades** - Alta, media y baja
- ✅ **Responsive** - Funciona en móviles y tablets
- ✅ **Persistencia** - Guarda sesión en localStorage

## 📋 Requisitos

- Backend ORGANIMEDIA corriendo en `http://localhost:3000`
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (Live Server, http-server, etc.)

## 🏃‍♂️ Cómo Usar

### Opción 1: Visual Studio Code + Live Server

1. Abre la carpeta `frontend` en VS Code
2. Instala la extensión "Live Server"
3. Click derecho en `index.html` → "Open with Live Server"
4. El navegador se abrirá automáticamente en `http://localhost:5500`

### Opción 2: http-server (Node.js)

```bash
# Instalar http-server globalmente (solo una vez)
npm install -g http-server

# Ejecutar desde la carpeta frontend
cd frontend
http-server -p 5500 -c-1
```

Abre tu navegador en `http://localhost:5500`

### Opción 3: Python

```bash
# Python 3
cd frontend
python -m http.server 5500

# Python 2
cd frontend
python -m SimpleHTTPServer 5500
```

### Opción 4: Abrir directamente

⚠️ **Nota**: Algunos navegadores pueden bloquear las peticiones al backend por CORS al abrir el archivo directamente. Se recomienda usar un servidor local.

## 🔧 Configuración

Si tu backend está en una URL diferente a `http://localhost:3000`, edita el archivo [app.js](app.js) línea 2:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
// Cambiar a tu URL del backend
```

## 📚 Funcionalidades

### 1. Registro e Inicio de Sesión

- **Registro**: Crea una cuenta nueva con usuario, contraseña y teléfono
- **Login**: Inicia sesión con tus credenciales
- **Token JWT**: Se guarda automáticamente en localStorage

### 2. Calendario

- **Vista Mensual**: Navega entre meses
- **Tareas Visibles**: Las tareas aparecen en sus fechas correspondientes
- **Colores por Prioridad**:
  - 🔴 Rojo = Alta
  - 🟡 Amarillo = Media
  - 🟢 Verde = Baja

### 3. Gestión de Tareas

#### Crear Tarea
- Click en "+" o en un día del calendario
- Completa el formulario:
  - **Título**: Nombre de la tarea (requerido)
  - **Descripción**: Detalles opcionales
  - **Fecha**: Cuándo realizar la tarea
  - **Prioridad**: Alta, Media o Baja
  - **Recordatorio**: Activar/desactivar

#### Ver Tareas
- Click en cualquier día del calendario
- Se mostrará el panel lateral con las tareas

#### Completar Tarea
- Click en el botón ✓ (check) de la tarea
- La tarea se marca como completada (tachada)
- Click nuevamente para descompletarla

#### Eliminar Tarea
- Click en el botón 🗑️ (papelera)
- Confirma la eliminación

### 4. Configuración

- Click en el botón ⚙️ (engranaje)
- Actualiza tu teléfono y hora de recordatorio
- Los cambios se guardan automáticamente

### 5. Cerrar Sesión

- Click en "Cerrar Sesión" en la esquina superior derecha
- Tu sesión se cerrará y volverás al login

## 🎨 Interfaz

### Pantalla de Login/Registro

- Diseño moderno con pestañas
- Validación de campos
- Mensajes de error claros
- Animaciones suaves

### Vista del Calendario

```
┌─────────────────────────────────────────┐
│  [Mes Actual]      [Hoy] [Configuración]│
│  [◀ Anterior]            [Siguiente ▶]  │
├─────────────────────────────────────────┤
│  Dom  Lun  Mar  Mié  Jue  Vie  Sáb     │
│   1    2    3    4    5    6    7       │
│  [●]                 [●]                 │
│   8    9   10   11   12   13   14       │
│            [●]                           │
│  ...                                     │
└─────────────────────────────────────────┘
```

Los círculos (●) representan días con tareas.

### Panel Lateral

Se abre al:
- Click en un día del calendario
- Click en el botón "+"
- Click en Configuración

## 🔐 Seguridad

- ✅ Las contraseñas se envían hasheadas al backend
- ✅ Token JWT almacenado de forma segura
- ✅ Sesión persiste entre recargas de página
- ✅ Cierre de sesión automático si el token expira

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Problema**: No se puede conectar al backend

**Solución**:
1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Ejecuta: `curl http://localhost:3000/api/health`
3. Si no funciona, inicia el backend: `cd backend && npm start`

### Error: "CORS policy"

**Problema**: Navegador bloquea peticiones por CORS

**Solución**:
1. No abras el archivo HTML directamente
2. Usa un servidor local (Live Server, http-server, etc.)
3. Verifica que el backend tenga CORS configurado correctamente

### Error: "Sesión expirada"

**Problema**: Token JWT expirado (por defecto 7 días)

**Solución**:
1. Cierra sesión y vuelve a iniciar sesión
2. Tu token se renovará

### Las tareas no se cargan

**Problema**: No se muestran las tareas creadas

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Verifica que el backend responda correctamente
4. Refresca la página

## 📱 Responsive Design

El frontend es completamente responsive:

- 📱 **Móvil** (< 768px): Vista optimizada para pantallas pequeñas
- 💻 **Tablet** (768px - 1024px): Interfaz adaptada
- 🖥️ **Desktop** (> 1024px): Vista completa

## 🎯 Próximas Mejoras

- [ ] Modo oscuro
- [ ] Filtros avanzados de tareas
- [ ] Vista de lista además de calendario
- [ ] Notificaciones push
- [ ] Edición inline de tareas
- [ ] Arrastrar y soltar tareas entre fechas
- [ ] Compartir tareas entre usuarios
- [ ] Exportar calendario a PDF/ICS

## 📄 Estructura de Archivos

```
frontend/
├── index.html      # Estructura HTML principal
├── app.js          # Lógica de la aplicación
├── styles.css      # Estilos (incrustados en index.html)
└── README.md       # Este archivo
```

## 🔗 API Endpoints Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/profile` | Obtener perfil |
| PUT | `/api/auth/profile` | Actualizar perfil |
| GET | `/api/tasks` | Listar tareas |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| PATCH | `/api/tasks/:id/complete` | Completar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

## 💡 Consejos de Uso

1. **Organiza tus tareas**: Usa prioridades para identificar lo más importante
2. **Planifica con anticipación**: Crea tareas para los próximos días/semanas
3. **Revisa diariamente**: Click en "Hoy" para ver tus tareas del día
4. **Marca como completadas**: Al terminar una tarea, márcala como completada
5. **Actualiza tu perfil**: Configura tu teléfono para futuras notificaciones

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en [index.html](index.html):

```css
:root {
    --primary-red: #d62828;     /* Rojo principal */
    --primary-yellow: #fcbf49;  /* Amarillo principal */
    --dark-red: #b02323;        /* Rojo oscuro */
    /* ... más colores */
}
```

### Cambiar Idioma

Los textos están en español. Para traducir:

1. Busca los textos en [app.js](app.js)
2. Busca los textos en [index.html](index.html)
3. Reemplaza por tu idioma

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisa la sección de Troubleshooting
2. Consulta la consola del navegador
3. Verifica que el backend esté funcionando
4. Revisa los logs del backend

---

**Versión**: 2.0.0  
**Última actualización**: Diciembre 2025  
**Compatibilidad**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
