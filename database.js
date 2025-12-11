const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'organimedia_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    max: 20, // máximo de clientes en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Verificar conexión a la base de datos
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.stack);
        process.exit(1);
    } else {
        console.log('✅ Conexión a PostgreSQL establecida');
        
        // Verificar si las tablas existen
        client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `, (err, result) => {
            release();
            
            if (err) {
                console.error('❌ Error verificando tablas:', err.stack);
                return;
            }
            
            if (!result.rows[0].exists) {
                console.log('⚠️  Las tablas no existen. Ejecuta el script de creación de base de datos.');
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

// Función para ejecutar consultas
const query = (text, params) => {
    return pool.query(text, params);
};

// Función para obtener un cliente del pool
const getClient = () => {
    return pool.connect();
};

// Función para iniciar una transacción
const transaction = async (callback) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    query,
    getClient,
    transaction,
    pool
};