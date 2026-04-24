const validateAutorData = (req, res, next) => {
    let { nombre, apellido, email, password } = req.body;

    nombre = nombre?.trim();
    apellido = apellido?.trim();
    email = email?.trim();

    if (!nombre || !apellido || !email) {
        const error = new Error('Nombre, apellido y email son requeridos');
        error.status = 400;
        return next(error);
    }

    // (Bloquea <h1>, <script>, <div> y cualquier etiqueta)
    const htmlRegex = /<[^>]*>/g; 
    if (htmlRegex.test(nombre) || htmlRegex.test(apellido)) {
        const error = new Error('Ataque detectado: No se permiten etiquetas HTML en los nombres');
        error.status = 400;
        return next(error);
    }

    // 4. Validación de tipos (Solo letras y espacios, no números)
    const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    if (!onlyLettersRegex.test(nombre) || !onlyLettersRegex.test(apellido)) {
        const error = new Error('Validación fallida: Los nombres solo deben contener letras');
        error.status = 400;
        return next(error);
    }

    // 5. Validación de formato de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = new Error('El formato del correo electrónico no es válido');
        error.status = 400;
        return next(error);
    }

    // Guardar datos limpios en la tubería
    req.pipeline.input = { nombre, apellido, email, password };
    next();
};

const validateIdParam = (req, res, next) => {
    if (isNaN(req.params.id)) {
        const error = new Error('El ID debe ser un valor numérico');
        error.status = 400;
        return next(error);
    }
    next();
};

const validateSearchQuery = (req, res, next) => {
    const { q } = req.query;
    if (!q || q.trim() === '' || /<[^>]*>/g.test(q)) {
        const error = new Error('Búsqueda inválida o peligrosa detectada');
        error.status = 400;
        return next(error);
    }
    next();
};

module.exports = { validateAutorData, validateIdParam, validateSearchQuery };