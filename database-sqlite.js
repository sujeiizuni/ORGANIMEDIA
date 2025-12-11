const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta para el archivo de la base de datos
const dbPath = path.join(__dirname, 'organimedia.db');

// Crear/conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error con SQLite:', err.message);
    } else {
        console.log('✅ Conectado a SQLite (organimedia.db)');
        createTables();
    }
});

// Crear tablas
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        reminder_time TEXT DEFAULT '11:00',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        task_date TEXT NOT NULL,
        priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
        reminder BOOLEAN DEFAULT 1,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Insertar usuario por defecto
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (row.count === 0) {
            db.run(
                `INSERT INTO users (username, password, phone) VALUES (?, ?, ?)`,
                ['admin', 'YWRtaW4xMjM=', '+34612345678'],
                (err) => {
                    if (!err) console.log('👤 Usuario admin creado');
                }
            );
        }
    });
}

// Funciones para usar la base de datos
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

module.exports = { query, run, db };