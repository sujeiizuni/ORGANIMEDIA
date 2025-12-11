const { validationResult } = require('express-validator');
const User = require('../models/User');

class AuthController {
    // Registrar nuevo usuario
    static async register(req, res) {
        try {
            // Validar datos de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const { username, password, phone } = req.body;
            
            // Crear usuario
            const user = await User.create(username, password, phone);
            
            // Generar token
            const token = User.generateToken(user);
            
            // Devolver respuesta
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    phone: user.phone,
                    reminderTime: user.reminder_time
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(400).json({ error: error.message });
        }
    }
    
    // Iniciar sesión
    static async login(req, res) {
        try {
            // Validar datos de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const { username, password } = req.body;
            
            // Buscar usuario
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            
            // Verificar contraseña
            const isValidPassword = await User.verifyPassword(user, password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            
            // Generar token
            const token = User.generateToken(user);
            
            // Devolver respuesta
            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    phone: user.phone,
                    reminderTime: user.reminder_time
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Obtener perfil del usuario actual
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    phone: user.phone,
                    reminderTime: user.reminder_time,
                    createdAt: user.created_at
                }
            });
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Actualizar perfil del usuario
    static async updateProfile(req, res) {
        try {
            // Validar datos de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const { phone, reminder_time, currentPassword, newPassword } = req.body;
            const userId = req.user.id;
            
            const updates = {};
            
            // Verificar si se quiere cambiar la contraseña
            if (newPassword) {
                if (!currentPassword) {
                    return res.status(400).json({ error: 'La contraseña actual es requerida' });
                }
                
                // Verificar contraseña actual
                const user = await User.findByUsername(req.user.username);
                const isValidPassword = await User.verifyPassword(user, currentPassword);
                
                if (!isValidPassword) {
                    return res.status(401).json({ error: 'Contraseña actual incorrecta' });
                }
                
                updates.password = newPassword;
            }
            
            // Agregar otros campos a actualizar
            if (phone !== undefined) updates.phone = phone;
            if (reminder_time !== undefined) updates.reminder_time = reminder_time;
            
            // Actualizar usuario
            const updatedUser = await User.updateProfile(userId, updates);
            
            // Generar nuevo token si se cambió algo importante
            const token = User.generateToken(updatedUser);
            
            res.json({
                message: 'Perfil actualizado exitosamente',
                token,
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    phone: updatedUser.phone,
                    reminderTime: updatedUser.reminder_time
                }
            });
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            res.status(400).json({ error: error.message });
        }
    }
    
    // Verificar token (para mantener sesión activa)
    static async verifyToken(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            res.json({
                valid: true,
                user: {
                    id: user.id,
                    username: user.username,
                    phone: user.phone,
                    reminderTime: user.reminder_time
                }
            });
        } catch (error) {
            console.error('Error verificando token:', error);
            res.status(401).json({ valid: false, error: 'Token inválido' });
        }
    }
    
    // Cerrar sesión (solo en cliente, pero podemos invalidar tokens si usamos blacklist)
    static async logout(req, res) {
        try {
            // En una implementación real, podríamos agregar el token a una blacklist
            // Por ahora, solo respondemos éxito y el cliente elimina el token localmente
            
            res.json({
                message: 'Sesión cerrada exitosamente'
            });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = AuthController;