const express = require('express');
const cors = require('cors');

//llamamos a las varibles de entorno.
require('dotenv').config();

//llamamos a nuestro enrutador.
const autorRoutes = require('./routes/autorRoutes');
const libroRoutes = require('./routes/libroRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');     // NUEVO
const prestamoRoutes = require('./routes/prestamoRoutes');

const app = express();
// --- ESTO ES LO QUE TE FALTA ---
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3000;

// //habilitamos el cors dentro de la aplicacion.
// app.use(cors());
// // ESTO ES LO QUE EVITA EL ERROR DE VALORES NULL
// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

//rutas
app.use('/api/autores', autorRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/usuarios', usuarioRoutes);   // NUEVO
app.use('/api/prestamos', prestamoRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

