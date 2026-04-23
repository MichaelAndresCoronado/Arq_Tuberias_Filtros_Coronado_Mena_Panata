// src/routes/prestamoRoutes.js
const express = require('express');
const router = express.Router();

// Importaciones de los filtros
const inputFilters = require('../filters/input/prestamoInputFilters');
const processingFilters = require('../filters/processing/prestamoProcessingFilters');
const outputFilters = require('../filters/output/responseFilters');

// ==========================================
// TUBERÍAS PARA PRÉSTAMOS
// ==========================================

// Tubería: Crear un nuevo préstamo
router.post('/', 
    inputFilters.validatePrestamoData,        // 1. Validar que vengan los IDs y fechas correctas
    processingFilters.checkLibroAvailability, // 2. Lógica: ¿El libro está libre?
    processingFilters.createPrestamoInDb,     // 3. Registrar en BD
    outputFilters.sendCreatedResponse         // 4. Responder
);

// Tubería: Registrar devolución de un préstamo por su ID
router.put('/:id/devolucion', 
    inputFilters.validateIdParam,
    inputFilters.validateDevolucionData,      // Validar que manden la fecha_devolucion_real
    processingFilters.processDevolucionInDb,  // Lógica de actualización
    outputFilters.sendSuccessResponse
);

module.exports = router;