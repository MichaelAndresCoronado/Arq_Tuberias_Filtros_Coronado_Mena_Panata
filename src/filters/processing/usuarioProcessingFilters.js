// src/filters/processing/usuarioProcessingFilters.js
const Usuario = require('../../models/Usuario');

const createUsuarioInDb = async (req, res, next) => {
    try {
        const nuevoUsuario = await Usuario.createUsuario(req.pipeline.input);
        req.pipeline.response = nuevoUsuario;
        next();
    } catch (error) {
        next(error);
    }
};

const fetchPrestamosByUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Primero verificamos si el usuario existe
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            return next(err);
        }

        const prestamos = await Usuario.getPrestamos(id);
        req.pipeline.response = prestamos;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUsuarioInDb, fetchPrestamosByUser
};