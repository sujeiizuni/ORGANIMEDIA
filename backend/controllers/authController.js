import { body } from 'express-validator';
import User from '../models/User.js';

/**
 * Validadores para registro
 */
export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El username debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_@.]+$/)
    .withMessage('El username solo puede contener letras, números, guiones bajos, @ y punto'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+]{10,15}$/)
    .withMessage('Formato de teléfono inválido'),
];

/**
 * Validadores para login
 */
export const loginValidation = [
  body('username').notEmpty().withMessage('Username requerido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
];

class AuthController {
  /**
   * Registrar nuevo usuario
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { username, password, phone } = req.body;
      
      // Crear usuario
      const user = await User.create(username, password, phone);
      
      // Generar token
      const token = User.generateToken(user);
      
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          reminderTime: user.reminder_time,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Iniciar sesión
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      // Buscar usuario
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }
      
      // Verificar contraseña
      const isValidPassword = await User.verifyPassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }
      
      // Generar token
      const token = User.generateToken(user);
      
      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          reminderTime: user.reminder_time,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener perfil del usuario actual
   * GET /api/auth/profile
   */
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          reminderTime: user.reminder_time,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar perfil del usuario
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res, next) {
    try {
      const { phone, reminder_time, password } = req.body;
      const updates = {};

      if (phone !== undefined) updates.phone = phone;
      if (reminder_time !== undefined) updates.reminder_time = reminder_time;
      if (password !== undefined) updates.password = password;

      const updatedUser = await User.update(req.user.id, updates);
      
      res.json({
        message: 'Perfil actualizado exitosamente',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          phone: updatedUser.phone,
          reminderTime: updatedUser.reminder_time,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar cuenta
   * DELETE /api/auth/account
   */
  static async deleteAccount(req, res, next) {
    try {
      await User.delete(req.user.id);
      
      res.json({
        message: 'Cuenta eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
