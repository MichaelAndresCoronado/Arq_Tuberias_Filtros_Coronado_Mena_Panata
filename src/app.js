// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Importar el inicializador de la tubería
const initializePipeline = require('./filters/core/pipelineContext');

// 2. Importar las rutas (que ahora serán diseños de tuberías)
const autorRoutes = require('./routes/autorRoutes');
const libroRoutes = require('./routes/libroRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. CONECTAR EL PRIMER FILTRO GLOBAL
// Toda petición que entre, pasará primero por aquí para inicializar req.pipeline
app.use(initializePipeline);

// 4. Conectar las Tuberías de Enrutamiento
app.use('/api/autores', autorRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/prestamos', prestamoRoutes);

// 5. Rutas de salud
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ message: 'API con Arquitectura de Tuberías y Filtros' }));

// 6. FILTRO SUMIDERO DE ERRORES (Global Error Handler)
// Si cualquier filtro llama a next(error), el flujo caerá directamente aquí
app.use((err, req, res, next) => {
    console.error('Pipeline Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno en la tubería de procesamiento'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Tuberías corriendo en el puerto ${PORT}`);
});