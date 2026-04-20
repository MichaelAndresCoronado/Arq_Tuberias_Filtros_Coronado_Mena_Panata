const db = require('../config/db');

const Usuario = {
    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT id, nombre, apellido, email FROM usuario WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    getPrestamos: async (id) => {
        const [rows] = await db.query(`
            SELECT 
                p.id,
                DATE_FORMAT(p.fecha_prestamo, '%Y-%m-%d') AS fecha_prestamo,
                DATE_FORMAT(p.fecha_devolucion_prevista, '%Y-%m-%d') AS fecha_devolucion_prevista,
                DATE_FORMAT(p.fecha_devolucion_real, '%Y-%m-%d') AS fecha_devolucion_real,
                l.titulo,
                l.isbn
            FROM prestamo p
            JOIN libro l ON p.libro_id = l.id
            WHERE p.usuario_id = ?
        `, [id]);

        return rows;
    },

    createUsuario: async ({ nombre, apellido, email, password, rol_id = 1 }) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [userResult] = await connection.query(
                'INSERT INTO usuario (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
                [nombre, apellido, email, password]
            );

            const usuarioId = userResult.insertId;

            await connection.query(
                'INSERT INTO usuario_rol (usuario_id, rol_id) VALUES (?, ?)',
                [usuarioId, rol_id]
            );

            await connection.commit();

            return {
                id: usuarioId,
                nombre,
                apellido,
                email,
                rol_id,
                message: 'Usuario registrado exitosamente'
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = Usuario;