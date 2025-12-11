import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para configurar la base de datos
 * Lee y ejecuta el archivo database.sql
 */
async function setupDatabase() {
  try {
    console.log('🔧 Configurando base de datos ORGANIMEDIA...\n');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Dividir en comandos individuales (eliminar comentarios y comandos psql)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => {
        // Filtrar comandos vacíos y comandos psql
        return cmd && 
               !cmd.startsWith('--') && 
               !cmd.startsWith('\\') &&
               !cmd.toLowerCase().includes('create database');
      });

    console.log(`📄 Ejecutando ${commands.length} comandos SQL...\n`);

    // Ejecutar cada comando
    for (const [index, command] of commands.entries()) {
      if (command) {
        try {
          await db.query(command);
          console.log(`✅ Comando ${index + 1}/${commands.length} ejecutado`);
        } catch (error) {
          // Ignorar errores de "ya existe"
          if (error.code === '42P07' || error.message.includes('already exists')) {
            console.log(`⚠️  Comando ${index + 1} - Recurso ya existe (ignorando)`);
          } else {
            console.error(`❌ Error en comando ${index + 1}:`, error.message);
          }
        }
      }
    }

    // Verificar tablas creadas
    const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n📊 Tablas en la base de datos:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    // Verificar contadores
    const counts = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM tasks) as tasks;
    `);

    console.log('\n📈 Registros actuales:');
    console.log(`   Usuarios: ${counts.rows[0].users}`);
    console.log(`   Tareas: ${counts.rows[0].tasks}`);

    console.log('\n✅ Base de datos configurada exitosamente!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error configurando base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar setup
setupDatabase();
