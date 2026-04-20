const express = require('express');
const router = express.Router();
const { createPrestamo, returnPrestamo } = require('../controllers/prestamoController');

// Crear un nuevo préstamo
router.post('/', createPrestamo);

// NUEVO: Registrar devolución de un préstamo por su ID
router.put('/:id/devolucion', returnPrestamo);

module.exports = router;