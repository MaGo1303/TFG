const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    console.log('⏳ Conectando a MySQL en XAMPP...');
    try {
        // Conectar sin especificar la base de datos para poder crearla
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('✅ Conexión exitosa a MySQL.');

        await connection.query('DROP DATABASE IF EXISTS royalrent;');
        console.log('🗑️ Base de datos anterior eliminada (si existía).');

        // Leer el archivo schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Separar las consultas por punto y coma (ignorando los que estén en comentarios o strings si es simple)
        // Como es un schema sencillo, podemos hacer un split por ';'
        const queries = schema.split(';').map(q => q.trim()).filter(q => q.length > 0);

        console.log('⏳ Ejecutando schema.sql para crear base de datos y tablas...');
        for (let query of queries) {
            await connection.query(query);
        }

        console.log('✅ Base de datos "royalrent" creada e inicializada correctamente con datos de prueba.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:');
        console.error(error);
        process.exit(1);
    }
}

initDB();
