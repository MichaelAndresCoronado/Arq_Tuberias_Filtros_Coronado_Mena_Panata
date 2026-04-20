const Libro = require('../models/Libro');

const getAllLibros = async (req, res) => {
    try {
        const libros = await Libro.findAll();
        res.json(libros);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
}

const createLibro = async (req, res) => {
    try {
        const nuevoLibro = await Libro.createLibro(req.body);
        res.json(nuevoLibro);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear el libro' });
    }
}

// -------------------------------------------------------------------
// CUMPLIENDO EL REQUISITO: (req.params.id, req.body)
// -------------------------------------------------------------------

const getLibroById = async (req, res) => {
    try {
        // Pasamos ambos parámetros exactamente como se solicitó
        const libro = await Libro.findById(req.params.id, req.body);
        
        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json(libro);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener el libro' });
    }
}

const updateLibro = async (req, res) => {
    try {
        // Pasamos ambos parámetros exactamente como se solicitó
        const libroActualizado = await Libro.updateLibro(req.params.id, req.body);
        res.json(libroActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el libro' });
    }
}

// -------------------------------------------------------------------

const deleteLibro = async (req, res) => {
    try {
        const result = await Libro.deleteLibro(req.params.id);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar el libro' });
    }
}

module.exports = { getAllLibros, createLibro, getLibroById, updateLibro, deleteLibro };