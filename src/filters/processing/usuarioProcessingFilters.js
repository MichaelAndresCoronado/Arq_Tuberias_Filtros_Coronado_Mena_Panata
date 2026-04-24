const Usuario = require('../../models/Usuario');

const fetchAllUsuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario.findAll();
        req.pipeline.response = usuarios;
        next();
    } catch (error) {
        next(error);
    }
};

const fetchUsuarioById = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            return next(err);
        }
        req.pipeline.response = usuario;
        next();
    } catch (error) {
        next(error);
    }
};

const createUsuarioInDb = async (req, res, next) => {
    try {
        const nuevoUsuario = await Usuario.createUsuario(req.pipeline.input);
        req.pipeline.response = nuevoUsuario;
        next();
    } catch (error) {
        next(error);
    }
};

const updateUsuarioInDb = async (req, res, next) => {
    try {
        const usuarioActualizado = await Usuario.updateUsuario(req.params.id, req.pipeline.input);
        if (!usuarioActualizado) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            return next(err);
        }
        req.pipeline.response = usuarioActualizado;
        next();
    } catch (error) {
        next(error);
    }
};

const deleteUsuarioFromDb = async (req, res, next) => {
    try {
        const result = await Usuario.deleteUsuario(req.params.id);
        req.pipeline.response = result;
        next();
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            const err = new Error('No se puede eliminar el usuario porque tiene préstamos asociados');
            err.status = 409;
            return next(err);
        }
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
    fetchAllUsuarios,
    fetchUsuarioById,
    createUsuarioInDb,
    updateUsuarioInDb,
    deleteUsuarioFromDb,
    fetchPrestamosByUser
};