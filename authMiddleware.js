const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token de autenticación requerido' });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verificar token
        const decoded = User.verifyToken(token);
        
        // Adjuntar información del usuario a la request
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error('Error de autenticación:', error.message);
        
        if (error.message === 'Token inválido o expirado') {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        
        res.status(500).json({ error: 'Error de autenticación' });
    }
};

module.exports = authMiddleware;