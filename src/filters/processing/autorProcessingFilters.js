const Autor = require('../../models/Autor');

const fetchAllAutores = async (req, res, next) => {
    try {
        const autores = await Autor.findAll();
        req.pipeline.response = autores;
        next();
    } catch (error) {
        next(error);
    }
};

const searchAutoresDb = async (req, res, next) => {
    try {
        const { q } = req.query; // Lo sacamos del query params
        const autores = await Autor.searchByNameOrSurname(q);
        req.pipeline.response = autores;
        next();
    } catch (error) {
        next(error);
    }
};

const createAutorInDb = async (req, res, next) => {
    try {
        // Usamos los datos limpios y validados del Integrante 2
        const nuevoAutor = await Autor.createAutor(req.pipeline.input);
        req.pipeline.response = nuevoAutor;
        next();
    } catch (error) {
        next(error);
    }
};

const fetchAutorById = async (req, res, next) => {
    try {
        const autor = await Autor.findById(req.params.id);
        if (!autor) {
            const error = new Error('Autor no encontrado');
            error.status = 404;
            return next(error);
        }
        req.pipeline.response = autor;
        next();
    } catch (error) {
        next(error);
    }
};

const updateAutorInDb = async (req, res, next) => {
    try {
        const autorActualizado = await Autor.updateAutor(req.params.id, req.pipeline.input);
        if (!autorActualizado) {
            const error = new Error('Autor no encontrado para actualizar');
            error.status = 404;
            return next(error);
        }
        req.pipeline.response = autorActualizado;
        next();
    } catch (error) {
        next(error);
    }
};

const deleteAutorFromDb = async (req, res, next) => {
    try {
        const result = await Autor.deleteAutor(req.params.id);
        req.pipeline.response = result;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    fetchAllAutores, searchAutoresDb, createAutorInDb,
    fetchAutorById, updateAutorInDb, deleteAutorFromDb
};