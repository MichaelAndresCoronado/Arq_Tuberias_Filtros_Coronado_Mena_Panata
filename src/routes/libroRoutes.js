// src/routes/libroRoutes.js
const express = require('express');
const router = express.Router();

// Importaciones de los filtros (Tus compañeros crearán estos archivos)
const inputFilters = require('../filters/input/libroInputFilters');
const processingFilters = require('../filters/processing/libroProcessingFilters');
const outputFilters = require('../filters/output/responseFilters');

// ==========================================
// TUBERÍAS PARA LIBROS
// ==========================================

// Tubería: Obtener todos los libros
router.get('/', 
    processingFilters.fetchAllLibros, 
    outputFilters.sendSuccessResponse
);

// Tubería: Crear un nuevo libro
router.post('/', 
    inputFilters.validateLibroData, 
    processingFilters.createLibroInDb, 
    outputFilters.sendCreatedResponse
);

// Tubería: Obtener libro por ID
router.get('/:id', 
    inputFilters.validateIdParam, 
    processingFilters.fetchLibroById, 
    outputFilters.sendSuccessResponse
);

// Tubería: Actualizar libro
router.put('/:id', 
    inputFilters.validateIdParam,
    inputFilters.validateLibroData, 
    processingFilters.updateLibroInDb, 
    outputFilters.sendSuccessResponse
);

// Tubería: Eliminar libro
router.delete('/:id', 
    inputFilters.validateIdParam, 
    processingFilters.deleteLibroFromDb, 
    outputFilters.sendSuccessResponse
);

module.exports = router;