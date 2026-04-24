const mysql = require('mysql2');

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true, 
    dateStrings: true
});

//async - await
const promisePool = pool.promise();

// Sincronización mínima de esquema para entornos con BD previa.
const ensureSchema = async () => {
    try {
        const [columns] = await promisePool.query(
            `SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'libro'`,
            [process.env.DB_NAME]
        );

        const columnNames = new Set(columns.map((column) => column.COLUMN_NAME));

        if (!columnNames.has('anio_publicacion')) {
            await promisePool.query('ALTER TABLE libro ADD COLUMN anio_publicacion INT NULL');
        }

        if (!columnNames.has('edicion')) {
            await promisePool.query('ALTER TABLE libro ADD COLUMN edicion VARCHAR(50) NULL');
        }
    } catch (error) {
        console.error('No se pudo verificar/actualizar el esquema de libro:', error.message);
    }
};

ensureSchema();

module.exports = promisePool;