const Usuario = require('../models/Usuario');

const getPrestamosByUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Validar si el usuario existe (Requisito estricto: devolver 404)
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Obtener y retornar la lista de préstamos
        const prestamos = await Usuario.getPrestamos(id);
        res.status(200).json(prestamos);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los préstamos del usuario' });
    }
};

const createUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await Usuario.createUsuario(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
}; 

module.exports = { getPrestamosByUser, createUsuario };