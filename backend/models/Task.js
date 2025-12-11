import db from '../database.js';

class Task {
  /**
   * Crear una nueva tarea
   * @param {number} userId - ID del usuario propietario
   * @param {Object} taskData - Datos de la tarea
   * @returns {Promise<Object>} Tarea creada
   */
  static async create(userId, taskData) {
    try {
      const {
        title,
        description = null,
        task_date,
        priority = 'medium',
        reminder = true,
      } = taskData;

      const result = await db.query(
        `INSERT INTO tasks (user_id, title, description, task_date, priority, reminder) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [userId, title, description, task_date, priority, reminder]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }

  /**
   * Buscar tarea por ID
   * @param {number} taskId - ID de la tarea
   * @param {number} userId - ID del usuario (para validar propiedad)
   * @returns {Promise<Object|null>} Tarea o null
   */
  static async findById(taskId, userId) {
    try {
      const result = await db.query(
        'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
        [taskId, userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error buscando tarea:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las tareas de un usuario con filtros opcionales
   * @param {number} userId - ID del usuario
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} Lista de tareas
   */
  static async findByUserId(userId, filters = {}) {
    try {
      let query = 'SELECT * FROM tasks WHERE user_id = $1';
      const values = [userId];
      let paramCount = 2;

      // Aplicar filtros
      if (filters.completed !== undefined) {
        query += ` AND completed = $${paramCount++}`;
        values.push(filters.completed);
      }

      if (filters.priority) {
        query += ` AND priority = $${paramCount++}`;
        values.push(filters.priority);
      }

      if (filters.task_date) {
        query += ` AND task_date = $${paramCount++}`;
        values.push(filters.task_date);
      }

      if (filters.start_date && filters.end_date) {
        query += ` AND task_date BETWEEN $${paramCount++} AND $${paramCount++}`;
        values.push(filters.start_date, filters.end_date);
      }

      // Ordenar por fecha y prioridad
      query += ' ORDER BY task_date ASC, priority DESC, created_at DESC';

      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      throw error;
    }
  }

  /**
   * Obtener tareas pendientes de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de tareas pendientes
   */
  static async findPending(userId) {
    try {
      const result = await db.query(
        `SELECT * FROM tasks 
         WHERE user_id = $1 AND completed = false 
         ORDER BY task_date ASC, priority DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo tareas pendientes:', error);
      throw error;
    }
  }

  /**
   * Obtener tareas de hoy de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de tareas de hoy
   */
  static async findToday(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await db.query(
        'SELECT * FROM tasks WHERE user_id = $1 AND task_date = $2 ORDER BY priority DESC',
        [userId, today]
      );
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo tareas de hoy:', error);
      throw error;
    }
  }

  /**
   * Actualizar una tarea
   * @param {number} taskId - ID de la tarea
   * @param {number} userId - ID del usuario (para validar propiedad)
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object>} Tarea actualizada
   */
  static async update(taskId, userId, updates) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Construir query dinámicamente
      const allowedFields = ['title', 'description', 'task_date', 'priority', 'reminder', 'completed'];
      
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          fields.push(`${field} = $${paramCount++}`);
          values.push(updates[field]);
        }
      }

      if (fields.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      fields.push(`updated_at = $${paramCount++}`);
      values.push(new Date());
      values.push(taskId);
      values.push(userId);

      const query = `
        UPDATE tasks 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
        RETURNING *
      `;

      const result = await db.query(query, values);
      
      if (result.rowCount === 0) {
        throw new Error('Tarea no encontrada o sin permisos');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  }

  /**
   * Marcar tarea como completada
   * @param {number} taskId - ID de la tarea
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Tarea actualizada
   */
  static async markAsCompleted(taskId, userId) {
    return await this.update(taskId, userId, { completed: true });
  }

  /**
   * Eliminar una tarea
   * @param {number} taskId - ID de la tarea
   * @param {number} userId - ID del usuario (para validar propiedad)
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  static async delete(taskId, userId) {
    try {
      const result = await db.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
        [taskId, userId]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de tareas del usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Estadísticas
   */
  static async getStats(userId) {
    try {
      const result = await db.query(
        `SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE completed = true) as completed,
          COUNT(*) FILTER (WHERE completed = false) as pending,
          COUNT(*) FILTER (WHERE completed = false AND task_date < CURRENT_DATE) as overdue,
          COUNT(*) FILTER (WHERE task_date = CURRENT_DATE) as today
         FROM tasks 
         WHERE user_id = $1`,
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

export default Task;
