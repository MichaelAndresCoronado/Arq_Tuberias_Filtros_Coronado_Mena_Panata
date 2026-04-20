const express = require('express');
const router = express.Router();

const {
    getAllAutores,
    createAutor,
    getAutorById,
    updateAutor,
    deleteAutor,
    searchAutores // <-- Importamos la nueva función
} = require('../controllers/autorController'); 

// Rutas para la gestión de autores
router.get('/', getAllAutores);
router.post('/', createAutor);

// ATENCIÓN: La ruta estática '/buscar' DEBE ir antes de la dinámica '/:id'
router.get('/buscar', searchAutores); 

router.get('/:id', getAutorById); // Restaurado a su estado correcto
router.put('/:id', updateAutor);
router.delete('/:id', deleteAutor);

module.exports = router;