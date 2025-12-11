/**
 * Middleware para validar formato de request
 */
export const validateRequest = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!req.is('application/json')) {
      return res.status(400).json({ 
        error: 'Content-Type debe ser application/json' 
      });
    }
  }
  next();
};

/**
 * Middleware para manejo de errores global
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error global:', err);

  // Error de validación de PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Conflicto',
      message: 'El recurso ya existe',
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Error de referencia',
      message: 'Referencia inválida a otro recurso',
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: err.message,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      message: 'Por favor, inicia sesión nuevamente',
    });
  }

  // Error genérico
  res.status(err.statusCode || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware para rutas no encontradas
 */
export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
  });
};

export default { validateRequest, errorHandler, notFound };
