const express = require('express');
const router = express.Router();

const inputFilters = require('../filters/input/usuarioInputFilters');
const processingFilters = require('../filters/processing/usuarioProcessingFilters');
const outputFilters = require('../filters/output/responseFilters');

// Tubería: Obtener todos los usuarios
router.get('/', 
    processingFilters.fetchAllUsuarios, 
    outputFilters.sendSuccessResponse
);

// Tubería: Obtener usuario por ID
router.get('/:id',
    inputFilters.validateIdParam,
    processingFilters.fetchUsuarioById,
    outputFilters.sendSuccessResponse
);

// Tubería: Registrar usuario (lectores, bibliotecarios)
router.post('/', 
    inputFilters.validateUsuarioData, 
    processingFilters.createUsuarioInDb, 
    outputFilters.sendCreatedResponse
);

// Tubería: Actualizar usuario
router.put('/:id',
    inputFilters.validateIdParam,
    inputFilters.validateUsuarioUpdateData,
    processingFilters.updateUsuarioInDb,
    outputFilters.sendSuccessResponse
);

// Tubería: Eliminar usuario
router.delete('/:id',
    inputFilters.validateIdParam,
    processingFilters.deleteUsuarioFromDb,
    outputFilters.sendSuccessResponse
);

// Tubería: Obtener los préstamos de un usuario específico
router.get('/:id/prestamos', 
    inputFilters.validateIdParam, 
    processingFilters.fetchPrestamosByUser, 
    outputFilters.sendSuccessResponse
);

module.exports = router;