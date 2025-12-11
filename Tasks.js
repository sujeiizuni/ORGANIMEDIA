const db = require('../config/database');

class Task {
    // Crear tarea
    static async create(userId, taskData) {
        try {
            const { title, description, task_date, priority, reminder } = taskData;
            
            const result = await db.query(
                `INSERT INTO tasks (user_id, title, description, task_date, priority, reminder, completed)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [userId, title, description || null, task_date, priority || 'medium', reminder !== false, false]
            );
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener todas las tareas de un usuario
    static async findByUserId(userId, filters = {}) {
        try {
            let query = 'SELECT * FROM tasks WHERE user_id = $1';
            const values = [userId];
            let paramCount = 2;
            
            // Aplicar filtros
            if (filters.completed !== undefined) {
                query += ` AND completed = $${paramCount}`;
                values.push(filters.completed);
                paramCount++;
            }
            
            if (filters.priority) {
                query += ` AND priority = $${paramCount}`;
                values.push(filters.priority);
                paramCount++;
            }
            
            if (filters.task_date) {
                query += ` AND task_date = $${paramCount}`;
                values.push(filters.task_date);
                paramCount++;
            }
            
            if (filters.start_date && filters.end_date) {
                query += ` AND task_date BETWEEN $${paramCount} AND $${paramCount + 1}`;
                values.push(filters.start_date, filters.end_date);
                paramCount += 2;
            }
            
            // Ordenar por fecha y prioridad
            query += ' ORDER BY task_date, CASE priority WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 ELSE 3 END';
            
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener tarea por ID
    static async findById(id, userId = null) {
        try {
            let query = 'SELECT * FROM tasks WHERE id = $1';
            const values = [id];
            
            if (userId) {
                query += ' AND user_id = $2';
                values.push(userId);
            }
            
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Actualizar tarea
    static async update(id, userId, updates) {
        try {
            const fields = [];
            const values = [];
            let paramCount = 1;
            
            // Construir dinámicamente la consulta UPDATE
            if (updates.title !== undefined) {
                fields.push(`title = $${paramCount}`);
                values.push(updates.title);
                paramCount++;
            }
            
            if (updates.description !== undefined) {
                fields.push(`description = $${paramCount}`);
                values.push(updates.description);
                paramCount++;
            }
            
            if (updates.task_date !== undefined) {
                fields.push(`task_date = $${paramCount}`);
                values.push(updates.task_date);
                paramCount++;
            }
            
            if (updates.priority !== undefined) {
                fields.push(`priority = $${paramCount}`);
                values.push(updates.priority);
                paramCount++;
            }
            
            if (updates.reminder !== undefined) {
                fields.push(`reminder = $${paramCount}`);
                values.push(updates.reminder);
                paramCount++;
            }
            
            if (updates.completed !== undefined) {
                fields.push(`completed = $${paramCount}`);
                values.push(updates.completed);
                paramCount++;
            }
            
            if (fields.length === 0) {
                throw new Error('No hay campos para actualizar');
            }
            
            // Agregar campos de auditoría
            fields.push(`updated_at = CURRENT_TIMESTAMP`);
            
            values.push(id, userId);
            
            const result = await db.query(
                `UPDATE tasks 
                 SET ${fields.join(', ')}
                 WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
                 RETURNING *`,
                values
            );
            
            if (result.rows.length === 0) {
                throw new Error('Tarea no encontrada o no autorizada');
            }
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Eliminar tarea
    static async delete(id, userId) {
        try {
            const result = await db.query(
                'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
                [id, userId]
            );
            
            if (result.rows.length === 0) {
                throw new Error('Tarea no encontrada o no autorizada');
            }
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener estadísticas de tareas
    static async getStats(userId) {
        try {
            const result = await db.query(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority,
                    SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) as medium_priority,
                    SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) as low_priority
                FROM tasks 
                WHERE user_id = $1
            `, [userId]);
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener tareas próximas (para recordatorios)
    static async getUpcomingTasks(days = 1) {
        try {
            const result = await db.query(`
                SELECT t.*, u.username, u.phone, u.reminder_time
                FROM tasks t
                JOIN users u ON t.user_id = u.id
                WHERE t.reminder = true 
                AND t.completed = false
                AND t.task_date = CURRENT_DATE + INTERVAL '${days} day'
                AND u.phone IS NOT NULL
                AND u.phone != ''
                ORDER BY u.reminder_time, t.priority
            `);
            
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener tareas para hoy
    static async getTodayTasks(userId) {
        try {
            const result = await db.query(`
                SELECT * FROM tasks 
                WHERE user_id = $1 
                AND task_date = CURRENT_DATE
                ORDER BY 
                    CASE priority 
                        WHEN 'high' THEN 1 
                        WHEN 'medium' THEN 2 
                        ELSE 3 
                    END,
                    created_at
            `, [userId]);
            
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar tareas por texto
    static async search(userId, searchText) {
        try {
            const result = await db.query(`
                SELECT * FROM tasks 
                WHERE user_id = $1 
                AND (title ILIKE $2 OR description ILIKE $2)
                ORDER BY task_date DESC
            `, [userId, `%${searchText}%`]);
            
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener tareas por mes
    static async getByMonth(userId, year, month) {
        try {
            const result = await db.query(`
                SELECT * FROM tasks 
                WHERE user_id = $1 
                AND EXTRACT(YEAR FROM task_date) = $2
                AND EXTRACT(MONTH FROM task_date) = $3
                ORDER BY task_date
            `, [userId, year, month]);
            
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Task;