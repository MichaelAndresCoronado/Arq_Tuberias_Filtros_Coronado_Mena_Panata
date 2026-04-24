const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// 1. Importar el inicializador de la tubería
const initializePipeline = require('./filters/core/pipelineContext');

// 2. Importar las rutas (que ahora son diseños de tuberías)
const autorRoutes = require('./routes/autorRoutes');
const libroRoutes = require('./routes/libroRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 2.5. Servir archivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, '../public')));

// 3. CONECTAR EL PRIMER FILTRO GLOBAL
// Toda petición que entre, pasará primero por aquí
app.use(initializePipeline);

// 4. Conectar las Tuberías de Enrutamiento
app.use('/api/autores', autorRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/prestamos', prestamoRoutes);

// 5. Rutas de salud
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Ruta raíz - servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 6. FILTRO SUMIDERO DE ERRORES 
const globalErrorHandler = require('./filters/output/errorFilter');
app.use(globalErrorHandler);

// 7. INICIAR EL SERVIDOR (Declarado una sola vez)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Tuberías corriendo en el puerto ${PORT}`);
});