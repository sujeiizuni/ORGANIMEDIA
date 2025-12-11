const { validationResult } = require('express-validator');
const Task = require('../models/Task');

class TaskController {
    // Crear nueva tarea
    static async createTask(req, res) {
        try {
            // Validar datos de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const userId = req.user.id;
            const taskData = req.body;
            
            // Crear tarea
            const task = await Task.create(userId, taskData);
            
            res.status(201).json({
                message: 'Tarea creada exitosamente',
                task
            });
        } catch (error) {
            console.error('Error creando tarea:', error);
            res.status(400).json({ error: error.message });
        }
    }
    
    // Obtener todas las tareas del usuario
    static async getTasks(req, res) {
        try {
            const userId = req.user.id;
            const filters = {};
            
            // Aplicar filtros si se proporcionan
            if (req.query.completed) {
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
            
            // Obtener tareas
            const tasks = await Task.findByUserId(userId, filters);
            
            res.json(tasks);
        } catch (error) {
            console.error('Error obteniendo tareas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Obtener tarea específica
    static async getTask(req, res) {
        try {
            const userId = req.user.id;
            const taskId = parseInt(req.params.id);
            
            const task = await Task.findById(taskId, userId);
            
            if (!task) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
            
            res.json(task);
        } catch (error) {
            console.error('Error obteniendo tarea:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Actualizar tarea
    static async updateTask(req, res) {
        try {
            // Validar datos de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const userId = req.user.id;
            const taskId = parseInt(req.params.id);
            const updates = req.body;
            
            // Actualizar tarea
            const updatedTask = await Task.update(taskId, userId, updates);
            
            res.json({
                message: 'Tarea actualizada exitosamente',
                task: updatedTask
            });
        } catch (error) {
            console.error('Error actualizando tarea:', error);
            
            if (error.message === 'Tarea no encontrada o no autorizada') {
                return res.status(404).json({ error: error.message });
            }
            
            res.status(400).json({ error: error.message });
        }
    }
    
    // Eliminar tarea
    static async deleteTask(req, res) {
        try {
            const userId = req.user.id;
            const taskId = parseInt(req.params.id);
            
            // Eliminar tarea
            await Task.delete(taskId, userId);
            
            res.json({
                message: 'Tarea eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error eliminando tarea:', error);
            
            if (error.message === 'Tarea no encontrada o no autorizada') {
                return res.status(404).json({ error: error.message });
            }
            
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Obtener estadísticas de tareas
    static async getTaskStats(req, res) {
        try {
            const userId = req.user.id;
            
            const stats = await Task.getStats(userId);
            
            res.json(stats);
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Obtener tareas de hoy
    static async getTodayTasks(req, res) {
        try {
            const userId = req.user.id;
            
            const tasks = await Task.getTodayTasks(userId);
            
            res.json(tasks);
        } catch (error) {
            console.error('Error obteniendo tareas de hoy:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Buscar tareas
    static async searchTasks(req, res) {
        try {
            const userId = req.user.id;
            const { q } = req.query;
            
            if (!q || q.trim() === '') {
                return res.status(400).json({ error: 'Término de búsqueda requerido' });
            }
            
            const tasks = await Task.search(userId, q);
            
            res.json(tasks);
        } catch (error) {
            console.error('Error buscando tareas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Obtener tareas por mes
    static async getTasksByMonth(req, res) {
        try {
            const userId = req.user.id;
            const { year, month } = req.params;
            
            if (!year || !month) {
                return res.status(400).json({ error: 'Año y mes requeridos' });
            }
            
            const tasks = await Task.getByMonth(userId, parseInt(year), parseInt(month));
            
            res.json(tasks);
        } catch (error) {
            console.error('Error obteniendo tareas por mes:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Marcar tarea como completada
    static async completeTask(req, res) {
        try {
            const userId = req.user.id;
            const taskId = parseInt(req.params.id);
            
            // Actualizar tarea como completada
            const updatedTask = await Task.update(taskId, userId, { completed: true });
            
            res.json({
                message: 'Tarea marcada como completada',
                task: updatedTask
            });
        } catch (error) {
            console.error('Error completando tarea:', error);
            
            if (error.message === 'Tarea no encontrada o no autorizada') {
                return res.status(404).json({ error: error.message });
            }
            
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
    // Obtener tareas próximas (para el usuario)
    static async getUpcomingTasks(req, res) {
        try {
            const userId = req.user.id;
            const { days = 7 } = req.query;
            
            // Obtener todas las tareas del usuario
            const allTasks = await Task.findByUserId(userId);
            
            // Filtrar tareas próximas
            const today = new Date();
            const upcomingDate = new Date();
            upcomingDate.setDate(today.getDate() + parseInt(days));
            
            const upcomingTasks = allTasks.filter(task => {
                const taskDate = new Date(task.task_date);
                return taskDate >= today && taskDate <= upcomingDate && !task.completed;
            });
            
            res.json(upcomingTasks);
        } catch (error) {
            console.error('Error obteniendo tareas próximas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = TaskController;