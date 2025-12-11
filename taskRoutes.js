const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const TaskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Validadores
const createTaskValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('El título es requerido')
        .isLength({ max: 200 }).withMessage('El título no puede exceder los 200 caracteres'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descripción no puede exceder los 1000 caracteres'),
    
    body('task_date')
        .notEmpty().withMessage('La fecha es requerida')
        .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Prioridad inválida'),
    
    body('reminder')
        .optional()
        .isBoolean().withMessage('El recordatorio debe ser verdadero o falso')
];

const updateTaskValidator = [
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('El título no puede estar vacío')
        .isLength({ max: 200 }).withMessage('El título no puede exceder los 200 caracteres'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descripción no puede exceder los 1000 caracteres'),
    
    body('task_date')
        .optional()
        .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Prioridad inválida'),
    
    body('reminder')
        .optional()
        .isBoolean().withMessage('El recordatorio debe ser verdadero o falso'),
    
    body('completed')
        .optional()
        .isBoolean().withMessage('El estado de completado debe ser verdadero o falso')
];

const queryValidators = [
    query('completed')
        .optional()
        .isIn(['true', 'false']).withMessage('El filtro de completado debe ser true o false'),
    
    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Prioridad inválida'),
    
    query('task_date')
        .optional()
        .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
    
    query('start_date')
        .optional()
        .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
    
    query('end_date')
        .optional()
        .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
    
    query('days')
        .optional()
        .isInt({ min: 1, max: 30 }).withMessage('Los días deben ser un número entre 1 y 30'),
    
    query('q')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('El término de búsqueda debe tener entre 1 y 100 caracteres')
];

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de tareas
router.post('/', createTaskValidator, TaskController.createTask);
router.get('/', queryValidators, TaskController.getTasks);
router.get('/stats', TaskController.getTaskStats);
router.get('/today', TaskController.getTodayTasks);
router.get('/search', queryValidators, TaskController.searchTasks);
router.get('/upcoming', queryValidators, TaskController.getUpcomingTasks);
router.get('/month/:year/:month', [
    param('year').isInt({ min: 2000, max: 2100 }).withMessage('Año inválido'),
    param('month').isInt({ min: 1, max: 12 }).withMessage('Mes inválido (1-12)')
], TaskController.getTasksByMonth);

// Rutas de tarea específica
router.get('/:id', [
    param('id').isInt().withMessage('ID de tarea inválido')
], TaskController.getTask);

router.put('/:id', [
    param('id').isInt().withMessage('ID de tarea inválido'),
    ...updateTaskValidator
], TaskController.updateTask);

router.delete('/:id', [
    param('id').isInt().withMessage('ID de tarea inválido')
], TaskController.deleteTask);

router.put('/:id/complete', [
    param('id').isInt().withMessage('ID de tarea inválido')
], TaskController.completeTask);

module.exports = router;