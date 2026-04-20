const Autor = require('../models/Autor');

const getAllAutores = async (req, res) => {
    try {
        const autores = await Autor.findAll();
        res.json(autores);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener autores' });
    }
};

const createAutor = async (req, res) => {
    try {
        const nuevoAutor = await Autor.createAutor(req.body);
        res.status(201).json(nuevoAutor);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear el autor' });
    }
};

const getAutorById = async (req, res) => {
    try {
        const autor = await Autor.findById(req.params.id, req.body);

        if (!autor) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }

        res.json(autor);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener el autor' });
    }
};

const updateAutor = async (req, res) => {
    try {
        const autorActualizado = await Autor.updateAutor(req.params.id, req.body);

        if (!autorActualizado) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }

        res.json(autorActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el autor' });
    }
};

const deleteAutor = async (req, res) => {
    try {
        const result = await Autor.deleteAutor(req.params.id);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar el autor' });
    }
};

const searchAutores = async (req, res) => {
    try {
        const q = req.query.q;

        if (!q) {
            return res.status(400).json({ error: 'El parámetro de consulta "q" es obligatorio' });
        }

        const autores = await Autor.searchByNameOrSurname(q);
        res.status(200).json(autores);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al buscar los autores' });
    }
};

module.exports = {
    getAllAutores,
    createAutor,
    deleteAutor,
    getAutorById,
    updateAutor,
    searchAutores
};