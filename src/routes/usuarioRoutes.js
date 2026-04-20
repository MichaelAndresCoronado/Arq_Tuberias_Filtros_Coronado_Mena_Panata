const express = require('express');
const router = express.Router();
const { getPrestamosByUser, createUsuario } = require('../controllers/usuarioController');

// Ruta genérica para registrar usuarios (lectores, bibliotecarios)
router.post('/', createUsuario);

// Ruta: GET /api/usuarios/:id/prestamos
router.get('/:id/prestamos', getPrestamosByUser);

module.exports = router;