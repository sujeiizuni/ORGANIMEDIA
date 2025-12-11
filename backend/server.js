import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import db from './database.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { validateRequest, errorHandler, notFound } from './middleware/errorHandler.js';

// Crear aplicación Express
const app = express();
const PORT = config.server.port;

// Middleware globales
// Configurar CORS para aceptar múltiples orígenes
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origin (como Postman o curl) en desarrollo
    if (!origin && config.server.env === 'development') {
      return callback(null, true);
    }
    
    // Verificar si el origin está en la lista de permitidos
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(validateRequest);

// Logging middleware (solo desarrollo)
if (config.server.env === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  });
}

// ========== RUTAS ==========

/**
 * Ruta principal de la API
 * GET /api
 */
app.get('/api', (req, res) => {
  res.json({
    message: '🎉 ¡ORGANIMEDIA API funcionando correctamente!',
    version: '2.0.0',
    environment: config.server.env,
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        deleteAccount: 'DELETE /api/auth/account',
      },
      tasks: {
        list: 'GET /api/tasks',
        create: 'POST /api/tasks',
        get: 'GET /api/tasks/:id',
        update: 'PUT /api/tasks/:id',
        complete: 'PATCH /api/tasks/:id/complete',
        delete: 'DELETE /api/tasks/:id',
        pending: 'GET /api/tasks/pending',
        today: 'GET /api/tasks/today',
        stats: 'GET /api/tasks/stats',
      },
      health: 'GET /api/health',
    },
  });
});

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a BD
    await db.query('SELECT 1');
    
    res.json({
      status: 'OK',
      service: 'ORGANIMEDIA Backend',
      version: '2.0.0',
      environment: config.server.env,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      service: 'ORGANIMEDIA Backend',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Rutas de la aplicación
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Manejo de rutas no encontradas
app.use('*', notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// ========== INICIAR SERVIDOR ==========

const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 ORGANIMEDIA BACKEND v2.0.0');
  console.log('='.repeat(60));
  console.log(`📡 Servidor: http://localhost:${PORT}`);
  console.log(`🔧 Entorno: ${config.server.env}`);
  console.log(`🗄️  Base de datos: PostgreSQL`);
  console.log(`🕐 Iniciado: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));
  console.log('📋 Endpoints principales:');
  console.log(`   GET    http://localhost:${PORT}/api`);
  console.log(`   GET    http://localhost:${PORT}/api/health`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET    http://localhost:${PORT}/api/tasks`);
  console.log('='.repeat(60));
});

// ========== MANEJO DE CIERRE LIMPIO ==========

const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor...`);
  
  server.close(async () => {
    console.log('✅ Servidor HTTP cerrado');
    
    try {
      await db.closePool();
      console.log('✅ Conexiones de base de datos cerradas');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error cerrando conexiones:', error);
      process.exit(1);
    }
  });

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error('⚠️  Forzando cierre después de timeout');
    process.exit(1);
  }, 10000);
};

// Eventos de cierre
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  gracefulShutdown('unhandledRejection');
});

export default app;
