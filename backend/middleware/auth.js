import User from '../models/User.js';

/**
 * Middleware para verificar autenticación JWT
 */
export const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No autorizado', 
        message: 'Token no proporcionado' 
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = User.verifyToken(token);
    
    // Buscar usuario
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'No autorizado', 
        message: 'Usuario no encontrado' 
      });
    }

    // Agregar usuario al request
    req.user = {
      id: user.id,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({ 
      error: 'No autorizado', 
      message: 'Token inválido o expirado' 
    });
  }
};

/**
 * Middleware opcional de autenticación (no bloquea si no hay token)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = User.verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.user = {
          id: user.id,
          username: user.username,
        };
      }
    }
    
    next();
  } catch (error) {
    // Si hay error, simplemente continuar sin usuario
    next();
  }
};

export default { authenticate, optionalAuth };
