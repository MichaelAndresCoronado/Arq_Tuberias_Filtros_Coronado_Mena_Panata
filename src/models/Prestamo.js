const db = require('../config/db');

const Prestamo = {
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
    }
};

module.exports = Prestamo;