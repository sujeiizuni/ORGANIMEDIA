-- ==========================================
-- Script de Creación de Base de Datos
-- ORGANIMEDIA v2.0
-- PostgreSQL 12+
-- ==========================================

-- NOTA: Ejecutar este script en pgAdmin4 o psql
-- Si la base de datos no existe, créala primero:
-- CREATE DATABASE organimedia_db;

-- Conectarse a la base de datos:
-- \c organimedia_db;

-- ==========================================
-- EXTENSIONES
-- ==========================================

-- UUID para generar identificadores únicos si es necesario en el futuro
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLA: users
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    reminder_time TIME DEFAULT '11:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT username_length CHECK (
        char_length(username) >= 3 AND 
        char_length(username) <= 50
    ),
    CONSTRAINT username_format CHECK (
        username ~ '^[a-zA-Z0-9_]+$'
    ),
    CONSTRAINT phone_format CHECK (
        phone IS NULL OR 
        phone ~ '^[0-9+]{10,15}$'
    )
);

-- Comentarios en la tabla
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema ORGANIMEDIA';
COMMENT ON COLUMN users.id IS 'ID único del usuario';
COMMENT ON COLUMN users.username IS 'Nombre de usuario único (solo letras, números y guiones bajos)';
COMMENT ON COLUMN users.password IS 'Contraseña hasheada con bcrypt';
COMMENT ON COLUMN users.phone IS 'Número de teléfono (opcional)';
COMMENT ON COLUMN users.reminder_time IS 'Hora preferida para recibir recordatorios';

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ==========================================
-- TABLA: tasks
-- ==========================================

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    task_date DATE NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium',
    reminder BOOLEAN DEFAULT TRUE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    -- Constraints
    CONSTRAINT title_length CHECK (
        char_length(title) >= 1 AND 
        char_length(title) <= 200
    ),
    CONSTRAINT description_length CHECK (
        description IS NULL OR 
        char_length(description) <= 1000
    ),
    CONSTRAINT priority_values CHECK (
        priority IN ('low', 'medium', 'high')
    )
);

-- Comentarios en la tabla
COMMENT ON TABLE tasks IS 'Tabla de tareas/eventos del calendario';
COMMENT ON COLUMN tasks.id IS 'ID único de la tarea';
COMMENT ON COLUMN tasks.user_id IS 'ID del usuario propietario de la tarea';
COMMENT ON COLUMN tasks.title IS 'Título de la tarea';
COMMENT ON COLUMN tasks.description IS 'Descripción detallada (opcional)';
COMMENT ON COLUMN tasks.task_date IS 'Fecha de la tarea';
COMMENT ON COLUMN tasks.priority IS 'Prioridad: low, medium, high';
COMMENT ON COLUMN tasks.reminder IS 'Si debe enviar recordatorio';
COMMENT ON COLUMN tasks.completed IS 'Estado de completado';

-- Índices para tareas
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_task_date ON tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, task_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_completed ON tasks(user_id, completed);

-- ==========================================
-- FUNCIONES Y TRIGGERS
-- ==========================================

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para tasks
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- DATOS DE EJEMPLO (OPCIONAL - SOLO DESARROLLO)
-- ==========================================

-- Descomentar para insertar datos de prueba

-- Usuario de ejemplo (password: "password123" hasheado con bcrypt)
-- INSERT INTO users (username, password, phone) VALUES
-- ('demo', '$2b$10$XxzJ5vKZN8sXGZmwF.HYW.K4YHqKqYv6k8z8M8Z8M8Z8M8Z8M8Z8M', '+34612345678');

-- Tareas de ejemplo
-- INSERT INTO tasks (user_id, title, description, task_date, priority) VALUES
-- (1, 'Reunión de equipo', 'Revisión semanal del proyecto', CURRENT_DATE, 'high'),
-- (1, 'Enviar informe', 'Informe mensual de ventas', CURRENT_DATE + 1, 'medium'),
-- (1, 'Llamar al cliente', 'Seguimiento del proyecto X', CURRENT_DATE + 2, 'low');

-- ==========================================
-- VERIFICACIÓN FINAL
-- ==========================================

-- Ver todas las tablas creadas
\dt

-- Ver estructura de las tablas
\d users
\d tasks

-- Contar registros (debería ser 0 si no insertaste datos de ejemplo)
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM tasks) as total_tasks;

-- ==========================================
-- FIN DEL SCRIPT
-- ==========================================

SELECT '✅ Base de datos ORGANIMEDIA creada exitosamente!' as status;

CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_reminder ON tasks(reminder);
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, task_date);

-- Tabla de recordatorios enviados
CREATE TABLE IF NOT EXISTS sent_reminders (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_to VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    error_message TEXT,
    
    CONSTRAINT sent_to_format CHECK (sent_to ~ '^[0-9+]{10,15}$')
);

-- Índices para recordatorios
CREATE INDEX IF NOT EXISTS idx_sent_reminders_task_id ON sent_reminders(task_id);
CREATE INDEX IF NOT EXISTS idx_sent_reminders_sent_at ON sent_reminders(sent_at);
CREATE INDEX IF NOT EXISTS idx_sent_reminders_status ON sent_reminders(status);

-- Tabla de logs del sistema (opcional)
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL CHECK (level IN ('info', 'warning', 'error')),
    message TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Vista para obtener estadísticas de tareas por usuario
CREATE OR REPLACE VIEW user_task_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(t.id) as total_tasks,
    SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END) as completed_tasks,
    SUM(CASE WHEN t.completed = false THEN 1 ELSE 0 END) as pending_tasks,
    SUM(CASE WHEN t.priority = 'high' THEN 1 ELSE 0 END) as high_priority_tasks,
    SUM(CASE WHEN t.priority = 'medium' THEN 1 ELSE 0 END) as medium_priority_tasks,
    SUM(CASE WHEN t.priority = 'low' THEN 1 ELSE 0 END) as low_priority_tasks,
    MAX(t.task_date) as latest_task_date,
    MIN(t.task_date) as earliest_task_date
FROM users u
LEFT JOIN tasks t ON u.id = t.user_id
GROUP BY u.id, u.username;

-- Vista para obtener tareas próximas con recordatorios
CREATE OR REPLACE VIEW upcoming_reminders AS
SELECT 
    t.id as task_id,
    t.title,
    t.task_date,
    t.priority,
    u.id as user_id,
    u.username,
    u.phone,
    u.reminder_time
FROM tasks t
JOIN users u ON t.user_id = u.id
WHERE t.reminder = true 
AND t.completed = false
AND t.task_date >= CURRENT_DATE
AND t.task_date <= CURRENT_DATE + INTERVAL '7 days'
AND u.phone IS NOT NULL
AND u.phone != ''
ORDER BY t.task_date, u.reminder_time;

-- Insertar usuario de prueba (opcional, solo para desarrollo)
-- INSERT INTO users (username, password, phone) 
-- VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+34612345678')
-- ON CONFLICT (username) DO NOTHING;

-- Mensaje de confirmación
SELECT '✅ Base de datos ORGANIMEDIA creada exitosamente' as message;