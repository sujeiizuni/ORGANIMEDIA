import { Router } from 'express';
import TaskController, { 
  createTaskValidation, 
  updateTaskValidation,
  handleValidationErrors 
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/tasks/stats
 * @desc    Obtener estadísticas de tareas
 * @access  Private
 */
router.get('/stats', TaskController.getStats);

/**
 * @route   GET /api/tasks/pending
 * @desc    Obtener tareas pendientes
 * @access  Private
 */
router.get('/pending', TaskController.getPendingTasks);

/**
 * @route   GET /api/tasks/today
 * @desc    Obtener tareas de hoy
 * @access  Private
 */
router.get('/today', TaskController.getTodayTasks);

/**
 * @route   GET /api/tasks
 * @desc    Obtener todas las tareas del usuario (con filtros opcionales)
 * @access  Private
 * @query   completed, priority, task_date, start_date, end_date
 */
router.get('/', TaskController.getTasks);

/**
 * @route   POST /api/tasks
 * @desc    Crear nueva tarea
 * @access  Private
 */
router.post(
  '/',
  createTaskValidation,
  handleValidationErrors,
  TaskController.createTask
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Obtener tarea específica
 * @access  Private
 */
router.get('/:id', TaskController.getTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Actualizar tarea
 * @access  Private
 */
router.put(
  '/:id',
  updateTaskValidation,
  handleValidationErrors,
  TaskController.updateTask
);

/**
 * @route   PATCH /api/tasks/:id/complete
 * @desc    Marcar tarea como completada
 * @access  Private
 */
router.patch('/:id/complete', TaskController.completeTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Eliminar tarea
 * @access  Private
 */
router.delete('/:id', TaskController.deleteTask);

export default router;
