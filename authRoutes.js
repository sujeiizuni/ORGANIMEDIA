const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Validadores
const registerValidator = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    
    body('phone')
        .notEmpty().withMessage('El número de teléfono es requerido')
        .matches(/^[0-9+]{10,15}$/).withMessage('Número de teléfono inválido')
];

const loginValidator = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
];

const updateProfileValidator = [
    body('phone')
        .optional()
        .matches(/^[0-9+]{10,15}$/).withMessage('Número de teléfono inválido'),
    
    body('reminder_time')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Formato de hora inválido (HH:MM)'),
    
    body('newPassword')
        .optional()
        .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
    
    body('currentPassword')
        .custom((value, { req }) => {
            if (req.body.newPassword && !value) {
                throw new Error('La contraseña actual es requerida para cambiar la contraseña');
            }
            return true;
        })
];

// Rutas públicas
router.post('/register', registerValidator, AuthController.register);
router.post('/login', loginValidator, AuthController.login);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/update-profile', authMiddleware, updateProfileValidator, AuthController.updateProfile);
router.get('/verify-token', authMiddleware, AuthController.verifyToken);
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;