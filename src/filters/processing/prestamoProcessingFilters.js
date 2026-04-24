// src/filters/processing/prestamoProcessingFilters.js
const Prestamo = require('../../models/Prestamo');
const db = require('../../config/db');

// Filtro especializado: Verifica si el libro está disponible ANTES de guardar
const checkLibroAvailability = async (req, res, next) => {
    try {
        const { libro_id } = req.pipeline.input;
        const [prestamosActivos] = await db.query(
            'SELECT id FROM prestamo WHERE libro_id = ? AND activo = 1', 
            [libro_id]
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

module.exports = {
    checkLibroAvailability, createPrestamoInDb, processDevolucionInDb
};