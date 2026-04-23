// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();

// Importaciones de los filtros
const inputFilters = require('../filters/input/usuarioInputFilters');
const processingFilters = require('../filters/processing/usuarioProcessingFilters');
const outputFilters = require('../filters/output/responseFilters');

// ==========================================
// TUBERÍAS PARA USUARIOS
// ==========================================

// Tubería: Registrar usuario (lectores, bibliotecarios)
router.post('/', 
    inputFilters.validateUsuarioData, 
    processingFilters.createUsuarioInDb, 
    outputFilters.sendCreatedResponse
);

// Tubería: Obtener los préstamos de un usuario específico
router.get('/:id/prestamos', 
    inputFilters.validateIdParam, 
    processingFilters.fetchPrestamosByUser, 
    outputFilters.sendSuccessResponse
);

module.exports = router;