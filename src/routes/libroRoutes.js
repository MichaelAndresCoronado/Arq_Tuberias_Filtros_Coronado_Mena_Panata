const express = require('express');         //instancia del servidor express
const router = express.Router();            //nueva instancia del enrutador.

//importamos el controlador de libros para manejar las rutas relacionadas con libros.
const {
    getAllLibros,
    createLibro,
    getLibroById,
    updateLibro,
    deleteLibro 
} = require('../controllers/libroController'); 

//rutas para la gestion de libros
router.get('/', getAllLibros);
router.post('/', createLibro);
router.get('/:id', getLibroById);
router.put('/:id', updateLibro);
router.delete('/:id', deleteLibro);

module.exports = router;

// redireciona a las rutas de mi aplicacion.
