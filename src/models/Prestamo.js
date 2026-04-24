const db = require('../config/db');

const Prestamo = {
    findAll: async () => {
        const [rows] = await db.query(`
            SELECT 
                p.id,
                p.usuario_id,
                p.libro_id,
                u.nombre AS nombre_usuario,
                l.titulo AS titulo_libro,
                DATE_FORMAT(p.fecha_prestamo, '%Y-%m-%d') AS fecha_prestamo,
                DATE_FORMAT(p.fecha_devolucion_prevista, '%Y-%m-%d') AS fecha_devolucion_prevista,
                DATE_FORMAT(p.fecha_devolucion_real, '%Y-%m-%d') AS fecha_devolucion_real
            FROM prestamo p
            LEFT JOIN usuario u ON p.usuario_id = u.id
            LEFT JOIN libro l ON p.libro_id = l.id
        `);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.query(`
            SELECT 
                p.id,
                p.usuario_id,
                p.libro_id,
                u.nombre AS nombre_usuario,
                l.titulo AS titulo_libro,
                DATE_FORMAT(p.fecha_prestamo, '%Y-%m-%d') AS fecha_prestamo,
                DATE_FORMAT(p.fecha_devolucion_prevista, '%Y-%m-%d') AS fecha_devolucion_prevista,
                DATE_FORMAT(p.fecha_devolucion_real, '%Y-%m-%d') AS fecha_devolucion_real
            FROM prestamo p
            LEFT JOIN usuario u ON p.usuario_id = u.id
            LEFT JOIN libro l ON p.libro_id = l.id
            WHERE p.id = ?
        `, [id]);
        return rows[0];
    },

    createPrestamo: async ({ usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista }) => {
        try {
            const [result] = await db.query(
                'INSERT INTO prestamo (usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista) VALUES (?, ?, ?, ?)',
                [usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista]
            );
            return { id: result.insertId, usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El libro no está disponible (ya tiene un préstamo activo)');
            }
            throw error; 
        }
    },

    updatePrestamo: async (id, { usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista }) => {
        const [result] = await db.query(
            'UPDATE prestamo SET usuario_id = ?, libro_id = ?, fecha_prestamo = ?, fecha_devolucion_prevista = ? WHERE id = ?',
            [usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista, id]
        );

        if (result.affectedRows === 0) return null;

        return {
            id: Number(id),
            usuario_id,
            libro_id,
            fecha_prestamo,
            fecha_devolucion_prevista,
            message: 'Préstamo actualizado correctamente'
        };
    },

    // NUEVO: Registrar la devolución de un libro
    returnPrestamo: async (id, fecha_devolucion_real) => {
        // 1. Verificamos que el préstamo exista y no haya sido devuelto ya
        const [prestamos] = await db.query('SELECT fecha_devolucion_real FROM prestamo WHERE id = ?', [id]);
        
        if (prestamos.length === 0) {
            throw new Error('Préstamo no encontrado');
        }
        if (prestamos[0].fecha_devolucion_real !== null) {
            throw new Error('El libro ya fue devuelto previamente');
        }

        // 2. Actualizamos la fecha real de devolución
        await db.query(
            'UPDATE prestamo SET fecha_devolucion_real = ? WHERE id = ?',
            [fecha_devolucion_real, id]
        );

        return { id, fecha_devolucion_real, message: 'Libro devuelto exitosamente. El libro ya está disponible.' };
    },

    deletePrestamo: async (id) => {
        const [result] = await db.query('DELETE FROM prestamo WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return { message: 'Préstamo no encontrado' };
        }
        return { message: 'Préstamo eliminado correctamente' };
    }
};

module.exports = Prestamo;