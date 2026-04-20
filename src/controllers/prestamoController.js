const Prestamo = require('../models/Prestamo');

const createPrestamo = async (req, res) => {
    try {
        const nuevoPrestamo = await Prestamo.createPrestamo(req.body);
        res.status(201).json(nuevoPrestamo);
    } catch (error) {
        console.log(error);
        if (error.message.includes('no está disponible')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al crear el préstamo' });
    }
};

// NUEVO: Controlador para devolver el libro
const returnPrestamo = async (req, res) => {
    try {
        const { id } = req.params; // ID del préstamo a devolver
        const { fecha_devolucion_real } = req.body; // La fecha en que lo está devolviendo

        if (!fecha_devolucion_real) {
            return res.status(400).json({ error: 'La fecha de devolución real es obligatoria' });
        }

        const resultado = await Prestamo.returnPrestamo(id, fecha_devolucion_real);
        res.status(200).json(resultado);
    } catch (error) {
        console.log(error);
        if (error.message === 'Préstamo no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'El libro ya fue devuelto previamente') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al procesar la devolución' });
    }
};

module.exports = { createPrestamo, returnPrestamo };