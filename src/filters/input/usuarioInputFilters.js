// src/filters/input/usuarioInputFilters.js

const validateUsuarioData = (req, res, next) => {
    const { nombre, apellido, email, password, rol_id } = req.body;

    if (!nombre || !apellido || !email || !password) {
        const error = new Error('Nombre, apellido, email y contraseña son obligatorios');
        error.status = 400;
        return next(error);
    }

    if (!email.includes('@')) {
        const error = new Error('El formato del email no es válido');
        error.status = 400;
        return next(error);
    }

    req.pipeline.input = { nombre, apellido, email, password, rol_id: rol_id || 1 };
    next();
};

const validateIdParam = (req, res, next) => {
    if (isNaN(req.params.id)) {
        const error = new Error('El ID del usuario debe ser numérico');
        error.status = 400;
        return next(error);
    }
    next();
};

module.exports = {
    validateUsuarioData,
    validateIdParam
};