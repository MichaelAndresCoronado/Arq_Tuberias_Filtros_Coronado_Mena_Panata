const db = require('../config/db');


const Libro = {
    // Obtener todos los libros con los datos de su autor
    findAll: async () => {
        const [rows] = await db.query(
            `SELECT l.*, a.nombre, a.apellido
            FROM libro l
            JOIN autor a ON l.autor_id = a.id`
        );
        return rows;
    },

    // Crear un nuevo libro
    createLibro: async ({titulo, isbn, anio_publicacion, edicion, autor_id}) => {
        const [result] = await db.query(
            'INSERT INTO libro (titulo, isbn, anio_publicacion, edicion, autor_id) VALUES (?,?,?,?,?)',
            [titulo, isbn, anio_publicacion, edicion, autor_id]
        );
        return { id: result.insertId, titulo, isbn, anio_publicacion, edicion, autor_id, message: 'Libro creado exitosamente'};
    },

    //falta completar el actualizar, buscar por id y eliminar.

    // Buscar por ID (Recibiendo el body por el requerimiento estricto)
    findById: async (id, body) => {
        // Mantenemos el JOIN para que te devuelva el libro junto con los datos del autor
        const [rows] = await db.query(
            `SELECT l.*, a.nombre, a.apellido
            FROM libro l
            JOIN autor a ON l.autor_id = a.id
            WHERE l.id = ?`, 
            [id]
        );
        return rows[0];
    },

    // Actualizar Libro
    updateLibro: async (id, { titulo, isbn, anio_publicacion, edicion, autor_id }) => {
        await db.query(
            'UPDATE libro SET titulo = ?, isbn = ?, anio_publicacion = ?, edicion = ?, autor_id = ? WHERE id = ?',
            [titulo, isbn, anio_publicacion, edicion, autor_id, id]
        );
        return { id, titulo, isbn, anio_publicacion, edicion, autor_id, message: 'Libro actualizado correctamente' };
    },

    // Eliminar Libro
    deleteLibro: async (id) => {
        await db.query('DELETE FROM libro WHERE id = ?', [id]);
        return { message: 'Libro eliminado correctamente' };
    }

}

module.exports = Libro;