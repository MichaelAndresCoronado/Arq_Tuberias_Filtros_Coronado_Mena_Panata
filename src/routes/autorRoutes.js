const express = require('express');
const router = express.Router();

const inputFilters = require('../filters/input/autorInputFilters');
const processingFilters = require('../filters/processing/autorProcessingFilters');
const outputFilters = require('../filters/output/responseFilters');

// ==========================================
// DISEÑO DE TUBERÍAS
// ==========================================

// Tubería: Obtener todos los autores
router.get('/', 
    processingFilters.fetchAllAutores, 
    outputFilters.sendSuccessResponse
);

// Tubería: Buscar autores
router.get('/buscar', 
    inputFilters.validateSearchQuery, 
    processingFilters.searchAutoresDb, 
    outputFilters.sendSuccessResponse
);

// Tubería: Crear un nuevo autor
router.post('/', 
    inputFilters.validateAutorData,      // 1. Filtro: Validar que vengan nombre, apellido, etc.
    processingFilters.createAutorInDb,   // 3. Filtro: Crear el autor (transacción paso 2)
    outputFilters.sendCreatedResponse    // 4. Filtro: Enviar código 201 y el JSON
);

// Tubería: Obtener autor por ID
router.get('/:id', 
    inputFilters.validateIdParam, 
    processingFilters.fetchAutorById, 
    outputFilters.sendSuccessResponse
);

// Tubería: Actualizar autor
router.put('/:id', 
    inputFilters.validateIdParam,
    inputFilters.validateAutorData, 
    processingFilters.updateAutorInDb, 
    outputFilters.sendSuccessResponse
);

// Tubería: Eliminar autor
router.delete('/:id', 
    inputFilters.validateIdParam, 
    processingFilters.deleteAutorFromDb, 
    outputFilters.sendSuccessResponse
);

module.exports = router;