import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database.js';
import config from '../config/config.js';

class User {
  /**
   * Crear un nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña en texto plano
   * @param {string} phone - Teléfono (opcional)
   * @returns {Promise<Object>} Usuario creado
   */
  static async create(username, password, phone = null) {
    try {
      // Verificar si el usuario ya existe
      const existing = await this.findByUsername(username);
      if (existing) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

      // Insertar usuario
      const result = await db.query(
        `INSERT INTO users (username, password, phone) 
         VALUES ($1, $2, $3) 
         RETURNING id, username, phone, reminder_time, created_at`,
        [username, hashedPassword, phone]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario o null
   */
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT id, username, phone, reminder_time, created_at, updated_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error buscando usuario por ID:', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por nombre de usuario (incluye password para autenticación)
   * @param {string} username - Nombre de usuario
   * @returns {Promise<Object|null>} Usuario o null
   */
  static async findByUsername(username) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error buscando usuario por username:', error);
      throw error;
    }
  }

  /**
   * Verificar contraseña
   * @param {Object} user - Usuario con password hasheado
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<boolean>} true si la contraseña es correcta
   */
  static async verifyPassword(user, password) {
    try {
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      console.error('Error verificando contraseña:', error);
      throw error;
    }
  }

  /**
   * Generar token JWT
   * @param {Object} user - Usuario
   * @returns {string} Token JWT
   */
  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Verificar token JWT
   * @param {string} token - Token JWT
   * @returns {Object} Payload decodificado
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Actualizar perfil de usuario
   * @param {number} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async update(id, updates) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Construir query dinámicamente
      if (updates.phone !== undefined) {
        fields.push(`phone = $${paramCount++}`);
        values.push(updates.phone);
      }

      if (updates.reminder_time !== undefined) {
        fields.push(`reminder_time = $${paramCount++}`);
        values.push(updates.reminder_time);
      }

      if (updates.password !== undefined) {
        const hashedPassword = await bcrypt.hash(updates.password, config.security.bcryptRounds);
        fields.push(`password = $${paramCount++}`);
        values.push(hashedPassword);
      }

      if (fields.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      fields.push(`updated_at = $${paramCount++}`);
      values.push(new Date());
      values.push(id);

      const query = `
        UPDATE users 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, username, phone, reminder_time, created_at, updated_at
      `;

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }

  /**
   * Eliminar usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  }
}

export default User;
