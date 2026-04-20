// const db = require('../config/db');

// const Autor = {

//     // Obtener todos los autores
//     findAll: async () => {
//         const [rows] = await db.query('SELECT * FROM autor');//ojo este debe ser el nombre igual de la tabla de la base
//         return rows;
//     },

//     // Crear un nuevo autor
//     createAutor: async ({ nombre, apellido, fecha_nacimiento, nacionalidad, correo_electronico }) => {
//         const [result] = await db.query(
//             'INSERT INTO autor (nombre, apellido, fecha_nacimiento, nacionalidad, correo_electronico) VALUES (?,?,?,?,?)',
//             [nombre, apellido, fecha_nacimiento, nacionalidad, correo_electronico]
//         );
//         return { id: result.insertId, nombre, apellido, fecha_nacimiento, nacionalidad, correo_electronico, message: 'Se creó un nuevo autor' };
//     },


//     // Buscar por ID (Recibiendo el body por requerimiento estricto)
//     // Le ponemos "body" como segundo parámetro para atrapar el req.body
//     findById: async (id, body) => {
//         const [rows] = await db.query('SELECT * FROM autor WHERE id = ?', [id]);
//         return rows[0]; 
//     },
    
    
//     // // Buscar por ID
//     // findById: async (id) => {
//     //     const [rows] = await db.query('SELECT * FROM autor WHERE id = ?', [id]);
//     //     // rows es un arreglo con los resultados. Retornamos la posición 0 que contiene el autor, 
//     //     // o undefined si no se encontró ningún registro.
//     //     return rows[0]; 
//     // },


//     // Actualizar Autor
//     updateAutor: async (id, { nombre, apellido, fecha_nacimiento, nacionalidad, correo_electronico }) => {
//         await db.query(
//             'UPDATE autor SET nombre = ?, apellido = ?, fecha_nacimiento = ?, nacionalidad = ?, correo_electronico = ? WHERE id = ?',
//             [nombre, apellido, fecha_nacimiento, nacionalidad, correo_electronico, id]
//         );
//         // Retornamos el mismo objeto con el id adjunto y un mensaje de éxito, 
//         return { id, nombre, apellido, fecha_nacimiento, nacionalidad, correo_electronico, message: 'Autor actualizado correctamente' };
//     },

//     // Eliminar Autor
//     deleteAutor: async (id) => {
//         await db.query('DELETE FROM autor WHERE id = ?', [id]);
//         return { message: 'Autor eliminado correctamente' };
//     }
// }

// module.exports = Autor;


const db = require('../config/db');

const Autor = {
    // Obtener todos los autores (Haciendo JOIN con la tabla base usuario)
    findAll: async () => {
        const [rows] = await db.query(`
            SELECT a.id as autor_id, u.id as usuario_id, u.nombre, u.apellido, u.email 
            FROM autor a 
            JOIN usuario u ON a.usuario_id = u.id
        `);
        return rows;
    },

    // Crear un nuevo autor (Requiere Transacción para asegurar integridad)
    createAutor: async ({ nombre, apellido, email, password }) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Crear el usuario base
            const [userResult] = await connection.query(
                'INSERT INTO usuario (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
                [nombre, apellido, email, password]
            );
            const usuarioId = userResult.insertId;

            // 2. Vincular ese usuario a la tabla autor
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
            throw error; // Lanzamos el error para que el controlador lo atrape
        } finally {
            connection.release();
        }
    },

    // Buscar por ID (Recibiendo el body por requerimiento estricto)
    findById: async (id, body) => {
        const [rows] = await db.query(`
            SELECT a.id as autor_id, u.id as usuario_id, u.nombre, u.apellido, u.email 
            FROM autor a 
            JOIN usuario u ON a.usuario_id = u.id 
            WHERE a.id = ?
        `, [id]);
        return rows[0]; 
    },

    // Buscar autores por coincidencia parcial en nombre o apellido
    searchByNameOrSurname: async (q) => {
        const searchTerm = `%${q}%`;
        const [rows] = await db.query(`
            SELECT a.id as autor_id, u.id as usuario_id, u.nombre, u.apellido, u.email 
            FROM autor a 
            JOIN usuario u ON a.usuario_id = u.id 
            WHERE u.nombre LIKE ? OR u.apellido LIKE ?
        `, [searchTerm, searchTerm]);
        return rows;
    },

    // Actualizar Autor (Extraemos los datos del req.body)
    updateAutor: async (id, body) => {
        const { nombre, apellido, email } = body;
        
        // 1. Obtenemos el usuario_id asociado a este autor
        const [autorRows] = await db.query('SELECT usuario_id FROM autor WHERE id = ?', [id]);
        
        if (autorRows.length === 0) return null;
        
        const usuarioId = autorRows[0].usuario_id;

        // 2. Actualizamos la tabla base
        await db.query(
            'UPDATE usuario SET nombre = ?, apellido = ?, email = ? WHERE id = ?',
            [nombre, apellido, email, usuarioId]
        );
        
        return { id, nombre, apellido, email, message: 'Autor actualizado correctamente' };
    },

    // Eliminar Autor
    deleteAutor: async (id) => {
        // Buscamos a qué usuario pertenece este autor
        const [autorRows] = await db.query('SELECT usuario_id FROM autor WHERE id = ?', [id]);
        
        if (autorRows.length > 0) {
            const usuarioId = autorRows[0].usuario_id;
            // Gracias al "ON DELETE CASCADE" en nuestra BD, al eliminar el usuario,
            // automáticamente se elimina su registro en la tabla autor.
            await db.query('DELETE FROM usuario WHERE id = ?', [usuarioId]);
        }
        
        return { message: 'Autor eliminado correctamente' };
    }
}

module.exports = Autor;