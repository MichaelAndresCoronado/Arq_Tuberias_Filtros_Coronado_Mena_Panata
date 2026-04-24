// src/filters/processing/libroProcessingFilters.js
const Libro = require('../../models/Libro');

const fetchAllLibros = async (req, res, next) => {
    try {
        const libros = await Libro.findAll();
        req.pipeline.response = libros;
        next();
    } catch (error) {
        next(error);
    }
};

const createLibroInDb = async (req, res, next) => {
    try {
        const nuevoLibro = await Libro.createLibro(req.pipeline.input);
        req.pipeline.response = nuevoLibro;
        next();
    } catch (error) {
        next(error);
    }
};

const fetchLibroById = async (req, res, next) => {
    try {
        const libro = await Libro.findById(req.params.id);
        if (!libro) {
            const err = new Error('Libro no encontrado');
            err.status = 404;
            return next(err);
        }
        req.pipeline.response = libro;
        next();
    } catch (error) {
        next(error);
    }
};

const updateLibroInDb = async (req, res, next) => {
    try {
        const libroActualizado = await Libro.updateLibro(req.params.id, req.pipeline.input);
        if (!libroActualizado) {
            const err = new Error('Libro no encontrado');
            err.status = 404;
            return next(err);
        }
        req.pipeline.response = libroActualizado;
        next();
    } catch (error) {
        next(error);
    }
};

const deleteLibroFromDb = async (req, res, next) => {
    try {
        const result = await Libro.deleteLibro(req.params.id);
        req.pipeline.response = result;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    fetchAllLibros, createLibroInDb, fetchLibroById,
    updateLibroInDb, deleteLibroFromDb
};