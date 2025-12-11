import pkg from 'pg';
const { Pool } = pkg;
import config from './config/config.js';

// Configuración del pool de conexiones PostgreSQL
const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port,
    max: config.database.max,
    idleTimeoutMillis: config.database.idleTimeoutMillis,
    connectionTimeoutMillis: config.database.connectionTimeoutMillis,
});

// Verificar conexión a la base de datos
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err.stack);
        process.exit(1);
    } else {
        console.log('✅ Conexión a PostgreSQL establecida');
        
        // Verificar si las tablas existen
        client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            ) as users_exists,
            EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'tasks'
            ) as tasks_exists;
        `, (err, result) => {
            release();
            
            if (err) {
                console.error('❌ Error verificando tablas:', err.stack);
                return;
            }
            
            const { users_exists, tasks_exists } = result.rows[0];
            
            if (!users_exists || !tasks_exists) {
                console.log('⚠️  Las tablas no existen. Ejecuta el script database.sql en pgAdmin4');
                console.log('   O ejecuta: npm run db:setup');
            } else {
                console.log('✅ Base de datos verificada correctamente');
            }
        });
    }
});

// Middleware para manejar errores de conexión
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de conexiones:', err);
    process.exit(-1);
});

/**
 * Ejecutar una consulta SQL
 * @param {string} text - Consulta SQL
 * @param {Array} params - Parámetros de la consulta
 * @returns {Promise} Resultado de la consulta
 */
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        
        if (config.server.env === 'development') {
            console.log('📊 Query ejecutada:', { text, duration: `${duration}ms`, rows: result.rowCount });
        }
        
        return result;
    } catch (error) {
        console.error('❌ Error en query:', { text, error: error.message });
        throw error;
    }
};

/**
 * Obtener un cliente del pool para transacciones
 * @returns {Promise} Cliente de PostgreSQL
 */
const getClient = async () => {
    return await pool.connect();
};

/**
 * Ejecutar una transacción
 * @param {Function} callback - Función que contiene las operaciones de la transacción
 * @returns {Promise} Resultado de la transacción
 */
const transaction = async (callback) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error en transacción, haciendo ROLLBACK:', error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Cerrar todas las conexiones del pool
 * @returns {Promise} Promesa de cierre
 */
const closePool = async () => {
    try {
        await pool.end();
        console.log('✅ Pool de conexiones cerrado correctamente');
    } catch (error) {
        console.error('❌ Error cerrando pool:', error);
        throw error;
    }
};

export default {
    query,
    getClient,
    transaction,
    closePool,
    pool
};
