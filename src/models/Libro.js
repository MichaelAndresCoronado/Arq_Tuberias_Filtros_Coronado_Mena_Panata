// const db = require('../config/db');

// const Libro = {
//     findAll: async () => {
//         const [rows] = await db.query(`
//             SELECT 
//                 l.id,
//                 l.titulo,
//                 l.isbn,
//                 l.stock,
//                 l.autor_id,
//                 u.nombre,
//                 u.apellido
//             FROM libro l
//             JOIN autor a ON l.autor_id = a.id
//             JOIN usuario u ON a.usuario_id = u.id
//         `);
//         return rows;
//     },

//     createLibro: async ({ titulo, isbn, stock = 1, autor_id }) => {
//         const [result] = await db.query(
//             'INSERT INTO libro (titulo, isbn, stock, autor_id) VALUES (?, ?, ?, ?)',
//             [titulo, isbn, stock, autor_id]
//         );

//         return {
//             id: result.insertId,
//             titulo,
//             isbn,
//             stock,
//             autor_id,
//             message: 'Libro creado exitosamente'
//         };
//     },

//     findById: async (id, body) => {
//         const [rows] = await db.query(`
//             SELECT 
//                 l.id,
//                 l.titulo,
//                 l.isbn,
//                 l.stock,
//                 l.autor_id,
//                 u.nombre,
//                 u.apellido
//             FROM libro l
//             JOIN autor a ON l.autor_id = a.id
//             JOIN usuario u ON a.usuario_id = u.id
//             WHERE l.id = ?
//         `, [id]);

//         return rows[0];
//     },

//     updateLibro: async (id, { titulo, isbn, stock, autor_id }) => {
//         const [result] = await db.query(
//             'UPDATE libro SET titulo = ?, isbn = ?, stock = ?, autor_id = ? WHERE id = ?',
//             [titulo, isbn, stock, autor_id, id]
//         );

//         if (result.affectedRows === 0) return null;

//         return {
//             id,
//             titulo,
//             isbn,
//             stock,
//             autor_id,
//             message: 'Libro actualizado correctamente'
//         };
//     },

//     deleteLibro: async (id) => {
//         await db.query('DELETE FROM libro WHERE id = ?', [id]);
//         return { message: 'Libro eliminado correctamente' };
//     }
// };

// module.exports = Libro;


// src/models/Libro.js
const db = require('../config/db');

const Libro = {
    findAll: async () => {
        const [rows] = await db.query(`
            SELECT 
                l.id, l.titulo, l.isbn, l.anio_publicacion, l.edicion, l.autor_id, 
                u.nombre, u.apellido
            FROM libro l
            JOIN autor a ON l.autor_id = a.id
            JOIN usuario u ON a.usuario_id = u.id
        `);
        return rows;
    },

    createLibro: async ({ titulo, isbn, anio_publicacion = null, edicion = null, autor_id }) => {
        const [result] = await db.query(
            'INSERT INTO libro (titulo, isbn, anio_publicacion, edicion, autor_id) VALUES (?, ?, ?, ?, ?)',
            [titulo, isbn, anio_publicacion, edicion, autor_id]
        );
        return { id: result.insertId, titulo, isbn, anio_publicacion, edicion, autor_id, message: 'Libro creado exitosamente' };
    },

    findById: async (id) => {
        const [rows] = await db.query(`
            SELECT 
                l.id, l.titulo, l.isbn, l.anio_publicacion, l.edicion, l.autor_id, 
                u.nombre, u.apellido
            FROM libro l
            JOIN autor a ON l.autor_id = a.id
            JOIN usuario u ON a.usuario_id = u.id
            WHERE l.id = ?
        `, [id]);
        return rows[0];
    },

    updateLibro: async (id, { titulo, isbn, anio_publicacion, edicion, autor_id }) => {
        const [result] = await db.query(
            'UPDATE libro SET titulo = ?, isbn = ?, anio_publicacion = ?, edicion = ?, autor_id = ? WHERE id = ?',
            [titulo, isbn, anio_publicacion, edicion, autor_id, id]
        );
        if (result.affectedRows === 0) return null;
        return { id, titulo, isbn, anio_publicacion, edicion, autor_id, message: 'Libro actualizado' };
    },

    deleteLibro: async (id) => {
        await db.query('DELETE FROM libro WHERE id = ?', [id]);
        return { message: 'Libro eliminado correctamente' };
    }
};

module.exports = Libro;