const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuración
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de prueba
app.get('/api', (req, res) => {
    res.json({
        message: '🎉 ¡ORGANIMEDIA API funcionando correctamente!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            tasks: '/api/tasks',
            health: '/api/health'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'ORGANIMEDIA Backend',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ruta de autenticación simulada
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    
    // Usuario de prueba
    res.json({
        message: 'Login exitoso',
        token: 'jwt_token_simulado_para_pruebas',
        user: {
            id: 1,
            username: username,
            phone: '+34612345678',
            reminderTime: '11:00'
        }
    });
});

app.post('/api/auth/register', (req, res) => {
    const { username, password, phone } = req.body;
    
    if (!username || !password || !phone) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token: 'jwt_token_simulado_para_pruebas',
        user: {
            id: Date.now(),
            username: username,
            phone: phone,
            reminderTime: '11:00'
        }
    });
});

// Ruta de tareas simuladas
app.get('/api/tasks', (req, res) => {
    // Tareas de ejemplo
    const tasks = [
        {
            id: 1,
            title: 'Reunión de equipo',
            description: 'Revisión del proyecto semanal',
            task_date: new Date().toISOString().split('T')[0],
            priority: 'high',
            reminder: true,
            completed: false
        },
        {
            id: 2,
            title: 'Enviar reporte',
            description: 'Reporte mensual de ventas',
            task_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
            priority: 'medium',
            reminder: true,
            completed: false
        }
    ];
    
    res.json(tasks);
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe`
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Contacta al administrador'
    });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 ORGANIMEDIA BACKEND INICIADO');
    console.log('='.repeat(50));
    console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🕐 Hora: ${new Date().toLocaleTimeString()}`);
    console.log('='.repeat(50));
    console.log('📋 Endpoints disponibles:');
    console.log(`   GET  http://localhost:${PORT}/api`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   GET  http://localhost:${PORT}/api/tasks`);
    console.log('='.repeat(50));
});

// Manejo de cierre limpio
process.on('SIGINT', () => {
    console.log('\n🛑 Recibida señal SIGINT. Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado exitosamente');
        process.exit(0);
    });
});