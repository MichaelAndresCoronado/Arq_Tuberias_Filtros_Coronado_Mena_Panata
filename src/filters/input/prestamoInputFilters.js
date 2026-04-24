// src/filters/input/prestamoInputFilters.js

const validatePrestamoData = (req, res, next) => {
    const { usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista } = req.body;

    if (!usuario_id || !libro_id || !fecha_prestamo || !fecha_devolucion_prevista) {
        const error = new Error('Faltan datos obligatorios para registrar el préstamo');
        error.status = 400;
        return next(error);
    }

    // Guardamos en la tubería
    req.pipeline.input = { usuario_id, libro_id, fecha_prestamo, fecha_devolucion_prevista };
    next();
};

const validateDevolucionData = (req, res, next) => {
    const { fecha_devolucion_real } = req.body;

    if (!fecha_devolucion_real) {
        const error = new Error('La fecha de devolución real es obligatoria');
        error.status = 400;
        return next(error);
    }

    req.pipeline.input = { fecha_devolucion_real };
    next();
};

const validateIdParam = (req, res, next) => {
    if (isNaN(req.params.id)) {
        const error = new Error('El ID del préstamo debe ser numérico');
        error.status = 400;
        return next(error);
    }
    next();
};

module.exports = {
    validatePrestamoData,
    validateDevolucionData,
    validateIdParam
};