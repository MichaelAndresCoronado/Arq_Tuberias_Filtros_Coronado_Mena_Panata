const Prestamo = require('../../models/Prestamo');
const db = require('../../config/db');

const fetchAllPrestamos = async (req, res, next) => {
    try {
        const prestamos = await Prestamo.findAll();
        req.pipeline.response = prestamos;
        next();
    } catch (error) {
        next(error);
    }
};

const fetchPrestamoById = async (req, res, next) => {
    try {
        const prestamo = await Prestamo.findById(req.params.id);
        if (!prestamo) {
            const err = new Error('Préstamo no encontrado');
            err.status = 404;
            return next(err);
        }
        req.pipeline.response = prestamo;
        next();
    } catch (error) {
        next(error);
    }
};

// Filtro especializado: Verifica si el libro está disponible ANTES de guardar
const checkLibroAvailability = async (req, res, next) => {
    try {
        const { libro_id } = req.pipeline.input;
        const currentPrestamoId = req.params.id;
        const [prestamosActivos] = await db.query(
            `SELECT id FROM prestamo WHERE libro_id = ? AND activo = 1 ${currentPrestamoId ? 'AND id <> ?' : ''}`,
            currentPrestamoId ? [libro_id, currentPrestamoId] : [libro_id]
        );

        if (prestamosActivos.length > 0) {
            const error = new Error('El libro no está disponible (ya tiene un préstamo activo)');
            error.status = 400; // Bad request
            return next(error);
        }
        next(); // Si está libre, pasa el flujo
    } catch (error) {
        next(error);
    }
};

const createPrestamoInDb = async (req, res, next) => {
    try {
        const nuevoPrestamo = await Prestamo.createPrestamo(req.pipeline.input);
        req.pipeline.response = nuevoPrestamo;
        next();
    } catch (error) {
        next(error);
    }
};

const updatePrestamoInDb = async (req, res, next) => {
    try {
        const prestamoActualizado = await Prestamo.updatePrestamo(req.params.id, req.pipeline.input);
        if (!prestamoActualizado) {
            const err = new Error('Préstamo no encontrado');
            err.status = 404;
            return next(err);
        }
        req.pipeline.response = prestamoActualizado;
        next();
    } catch (error) {
        next(error);
    }
};

const processDevolucionInDb = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fecha_devolucion_real } = req.pipeline.input;
        
        const resultado = await Prestamo.returnPrestamo(id, fecha_devolucion_real);
        req.pipeline.response = resultado;
        next();
    } catch (error) {
        // Manejamos los errores específicos del modelo de préstamos
        if (error.message.includes('no encontrado') || error.message.includes('ya fue devuelto')) {
            error.status = 400;
        }
        next(error);
    }
};

const deletePrestamoFromDb = async (req, res, next) => {
    try {
        const result = await Prestamo.deletePrestamo(req.params.id);
        req.pipeline.response = result;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    fetchAllPrestamos,
    fetchPrestamoById,
    checkLibroAvailability,
    createPrestamoInDb,
    updatePrestamoInDb,
    processDevolucionInDb,
    deletePrestamoFromDb
};