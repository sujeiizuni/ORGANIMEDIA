import { Router } from 'express';
import AuthController, { registerValidation, loginValidation } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidationErrors } from '../controllers/taskController.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  AuthController.login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario actual
 * @access  Private
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualizar perfil del usuario
 * @access  Private
 */
router.put('/profile', authenticate, AuthController.updateProfile);

/**
 * @route   DELETE /api/auth/account
 * @desc    Eliminar cuenta del usuario
 * @access  Private
 */
router.delete('/account', authenticate, AuthController.deleteAccount);

export default router;
