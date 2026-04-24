const express = require('express');
const router = express.Router();

// Importaciones de los filtros
const inputFilters = require('../filters/input/prestamoInputFilters');
const processingFilters = require('../filters/processing/prestamoProcessingFilters');
const outputFilters = require('../filters/output/responseFilters');

// Tubería: Obtener todos los préstamos
router.get('/',
    processingFilters.fetchAllPrestamos,
    outputFilters.sendSuccessResponse
);

// Tubería: Obtener préstamo por ID
router.get('/:id',
    inputFilters.validateIdParam,
    processingFilters.fetchPrestamoById,
    outputFilters.sendSuccessResponse
);

// Tubería: Crear un nuevo préstamo
router.post('/', 
    inputFilters.validatePrestamoData,        // 1. Validar que vengan los IDs y fechas correctas
    processingFilters.checkLibroAvailability, // 2. Lógica: ¿El libro está libre?
    processingFilters.createPrestamoInDb,     // 3. Registrar en BD
    outputFilters.sendCreatedResponse         // 4. Responder
);

// Tubería: Actualizar préstamo
router.put('/:id',
    inputFilters.validateIdParam,
    inputFilters.validatePrestamoData,
    processingFilters.checkLibroAvailability,
    processingFilters.updatePrestamoInDb,
    outputFilters.sendSuccessResponse
);

// Tubería: Registrar devolución de un préstamo por su ID
router.put('/:id/devolucion', 
    inputFilters.validateIdParam,
    inputFilters.validateDevolucionData,      // Validar que manden la fecha_devolucion_real
    processingFilters.processDevolucionInDb,  // Lógica de actualización
    outputFilters.sendSuccessResponse
);

// Tubería: Eliminar préstamo
router.delete('/:id',
    inputFilters.validateIdParam,
    processingFilters.deletePrestamoFromDb,
    outputFilters.sendSuccessResponse
);

module.exports = router;