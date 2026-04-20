const db = require('../config/db');

const Autor = {
    findAll: async () => {
        const [rows] = await db.query(`
            SELECT 
                a.id AS autor_id,
                u.id AS usuario_id,
                u.nombre,
                u.apellido,
                u.email
            FROM autor a
            JOIN usuario u ON a.usuario_id = u.id
        `);
        return rows;
    },

    createAutor: async ({ nombre, apellido, email, password }) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [userResult] = await connection.query(
                'INSERT INTO usuario (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
                [nombre, apellido, email, password]
            );

            const usuarioId = userResult.insertId;

            const [autorResult] = await connection.query(
                'INSERT INTO autor (usuario_id) VALUES (?)',
                [usuarioId]
            );

            await connection.commit();

            return {
                id: autorResult.insertId,
                usuario_id: usuarioId,
                nombre,
                apellido,
                email,
                message: 'Se creó un nuevo autor exitosamente'
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    findById: async (id, body) => {
        const [rows] = await db.query(`
            SELECT 
                a.id AS autor_id,
                u.id AS usuario_id,
                u.nombre,
                u.apellido,
                u.email
            FROM autor a
            JOIN usuario u ON a.usuario_id = u.id
            WHERE a.id = ?
        `, [id]);

        return rows[0];
    },

    searchByNameOrSurname: async (q) => {
        const searchTerm = `%${q}%`;
        const [rows] = await db.query(`
            SELECT 
                a.id AS autor_id,
                u.id AS usuario_id,
                u.nombre,
                u.apellido,
                u.email
            FROM autor a
            JOIN usuario u ON a.usuario_id = u.id
            WHERE u.nombre LIKE ? OR u.apellido LIKE ?
        `, [searchTerm, searchTerm]);

        return rows;
    },

    updateAutor: async (id, body) => {
        const { nombre, apellido, email } = body;

        const [autorRows] = await db.query(
            'SELECT usuario_id FROM autor WHERE id = ?',
            [id]
        );

        if (autorRows.length === 0) return null;

        const usuarioId = autorRows[0].usuario_id;

        await db.query(
            'UPDATE usuario SET nombre = ?, apellido = ?, email = ? WHERE id = ?',
            [nombre, apellido, email, usuarioId]
        );

        return {
            id,
            nombre,
            apellido,
            email,
            message: 'Autor actualizado correctamente'
        };
    },

    deleteAutor: async (id) => {
        const [autorRows] = await db.query(
            'SELECT usuario_id FROM autor WHERE id = ?',
            [id]
        );

        if (autorRows.length > 0) {
            const usuarioId = autorRows[0].usuario_id;
            await db.query('DELETE FROM usuario WHERE id = ?', [usuarioId]);
        }

        return { message: 'Autor eliminado correctamente' };
    }
};

module.exports = Autor;