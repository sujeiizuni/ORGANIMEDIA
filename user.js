const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

class User {
    // Crear usuario
    static async create(username, password, phone) {
        try {
            // Verificar si el usuario ya existe
            const existingUser = await db.query(
                'SELECT id FROM users WHERE username = $1',
                [username]
            );
            
            if (existingUser.rows.length > 0) {
                throw new Error('El usuario ya existe');
            }
            
            // Hash de la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Insertar usuario
            const result = await db.query(
                `INSERT INTO users (username, password, phone, reminder_time)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, username, phone, reminder_time, created_at`,
                [username, hashedPassword, phone, '11:00:00']
            );
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar usuario por username
    static async findByUsername(username) {
        try {
            const result = await db.query(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar usuario por ID
    static async findById(id) {
        try {
            const result = await db.query(
                'SELECT id, username, phone, reminder_time, created_at FROM users WHERE id = $1',
                [id]
            );
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Verificar contraseña
    static async verifyPassword(user, password) {
        try {
            return await bcrypt.compare(password, user.password);
        } catch (error) {
            throw error;
        }
    }
    
    // Generar token JWT
    static generateToken(user) {
        const payload = {
            id: user.id,
            username: user.username
        };
        
        return jwt.sign(
            payload,
            process.env.JWT_SECRET || 'organimedia_secret_key',
            { expiresIn: '7d' }
        );
    }
    
    // Actualizar perfil del usuario
    static async updateProfile(id, updates) {
        try {
            const fields = [];
            const values = [];
            let paramCount = 1;
            
            // Construir dinámicamente la consulta UPDATE
            if (updates.phone !== undefined) {
                fields.push(`phone = $${paramCount}`);
                values.push(updates.phone);
                paramCount++;
            }
            
            if (updates.reminder_time !== undefined) {
                fields.push(`reminder_time = $${paramCount}`);
                values.push(updates.reminder_time);
                paramCount++;
            }
            
            if (updates.password !== undefined) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(updates.password, salt);
                fields.push(`password = $${paramCount}`);
                values.push(hashedPassword);
                paramCount++;
            }
            
            if (fields.length === 0) {
                throw new Error('No hay campos para actualizar');
            }
            
            values.push(id);
            
            const result = await db.query(
                `UPDATE users 
                 SET ${fields.join(', ')}
                 WHERE id = $${paramCount}
                 RETURNING id, username, phone, reminder_time, created_at`,
                values
            );
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener todos los usuarios (solo para administradores)
    static async getAll() {
        try {
            const result = await db.query(
                'SELECT id, username, phone, reminder_time, created_at FROM users ORDER BY created_at DESC'
            );
            
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    // Eliminar usuario
    static async delete(id) {
        try {
            const result = await db.query(
                'DELETE FROM users WHERE id = $1 RETURNING id',
                [id]
            );
            
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Verificar token JWT
    static verifyToken(token) {
        try {
            return jwt.verify(
                token,
                process.env.JWT_SECRET || 'organimedia_secret_key'
            );
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
    
    // Obtener usuarios con tareas pendientes para recordatorios
    static async getUsersWithPendingReminders() {
        try {
            const result = await db.query(`
                SELECT DISTINCT u.*
                FROM users u
                JOIN tasks t ON u.id = t.user_id
                WHERE t.reminder = true 
                AND t.completed = false
                AND t.task_date = CURRENT_DATE + INTERVAL '1 day'
                AND u.phone IS NOT NULL
                AND u.phone != ''
            `);
            
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;