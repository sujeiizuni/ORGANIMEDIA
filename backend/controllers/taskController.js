import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';

/**
 * Validadores para crear tarea
 */
export const createTaskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('task_date')
    .isISO8601()
    .withMessage('Formato de fecha inválido (usar YYYY-MM-DD)'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Prioridad debe ser: low, medium o high'),
  
  body('reminder')
    .optional()
    .isBoolean()
    .withMessage('Reminder debe ser true o false'),
];

/**
 * Validadores para actualizar tarea
 */
export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('task_date')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha inválido (usar YYYY-MM-DD)'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Prioridad debe ser: low, medium o high'),
  
  body('reminder')
    .optional()
    .isBoolean()
    .withMessage('Reminder debe ser true o false'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed debe ser true o false'),
];

/**
 * Middleware para manejar errores de validación
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Errores de validación', 
      details: errors.array() 
    });
  }
  next();
};

class TaskController {
  /**
   * Crear nueva tarea
   * POST /api/tasks
   */
  static async createTask(req, res, next) {
    try {
      const userId = req.user.id;
      const task = await Task.create(userId, req.body);
      
      res.status(201).json({
        message: 'Tarea creada exitosamente',
        task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todas las tareas del usuario
   * GET /api/tasks
   */
  static async getTasks(req, res, next) {
    try {
      const userId = req.user.id;
      const filters = {};
      
      // Aplicar filtros desde query params
      if (req.query.completed !== undefined) {
        filters.completed = req.query.completed === 'true';
      }
      
      if (req.query.priority) {
        filters.priority = req.query.priority;
      }
      
      if (req.query.task_date) {
        filters.task_date = req.query.task_date;
      }
      
      if (req.query.start_date && req.query.end_date) {
        filters.start_date = req.query.start_date;
        filters.end_date = req.query.end_date;
      }
      
      const tasks = await Task.findByUserId(userId, filters);
      
      res.json({
        count: tasks.length,
        tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener tareas pendientes
   * GET /api/tasks/pending
   */
  static async getPendingTasks(req, res, next) {
    try {
      const tasks = await Task.findPending(req.user.id);
      
      res.json({
        count: tasks.length,
        tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener tareas de hoy
   * GET /api/tasks/today
   */
  static async getTodayTasks(req, res, next) {
    try {
      const tasks = await Task.findToday(req.user.id);
      
      res.json({
        count: tasks.length,
        tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadísticas de tareas
   * GET /api/tasks/stats
   */
  static async getStats(req, res, next) {
    try {
      const stats = await Task.getStats(req.user.id);
      
      res.json({
        stats: {
          total: parseInt(stats.total),
          completed: parseInt(stats.completed),
          pending: parseInt(stats.pending),
          overdue: parseInt(stats.overdue),
          today: parseInt(stats.today),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener tarea específica
   * GET /api/tasks/:id
   */
  static async getTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id);
      const task = await Task.findById(taskId, req.user.id);
      
      if (!task) {
        return res.status(404).json({ 
          error: 'Tarea no encontrada' 
        });
      }
      
      res.json({ task });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar tarea
   * PUT /api/tasks/:id
   */
  static async updateTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id);
      const updatedTask = await Task.update(taskId, req.user.id, req.body);
      
      res.json({
        message: 'Tarea actualizada exitosamente',
        task: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marcar tarea como completada
   * PATCH /api/tasks/:id/complete
   */
  static async completeTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id);
      const updatedTask = await Task.markAsCompleted(taskId, req.user.id);
      
      res.json({
        message: 'Tarea marcada como completada',
        task: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar tarea
   * DELETE /api/tasks/:id
   */
  static async deleteTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id);
      const deleted = await Task.delete(taskId, req.user.id);
      
      if (!deleted) {
        return res.status(404).json({ 
          error: 'Tarea no encontrada' 
        });
      }
      
      res.json({
        message: 'Tarea eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TaskController;
