// src/filters/input/libroInputFilters.js

const validateLibroData = (req, res, next) => {
    let { titulo, isbn, anio_publicacion, edicion, autor_id } = req.body;

    // 1. Sanitización de textos (Anti-HTML)
    const htmlRegex = /<[^>]*>/g;
    if (htmlRegex.test(titulo) || htmlRegex.test(edicion)) {
        const error = new Error('No se permite contenido HTML en el título o edición');
        error.status = 400;
        return next(error);
    }

    // 2. Validación de ISBN (10 o 13 dígitos numéricos)
    const cleanIsbn = isbn?.toString().replace(/-/g, '').trim();
    if (!/^\d{10}$|^\d{13}$/.test(cleanIsbn)) {
        const error = new Error('El ISBN debe tener exactamente 10 o 13 dígitos numéricos');
        error.status = 400;
        return next(error);
    }

    // 3. Validación de Rango de Año
    const currentYear = new Date().getFullYear();
    const yearInt = parseInt(anio_publicacion);
    if (isNaN(yearInt) || yearInt < 0 || yearInt > currentYear) {
        const error = new Error(`El año de publicación debe estar entre 0 y ${currentYear}`);
        error.status = 400;
        return next(error);
    }

    // Guardar en tubería
    req.pipeline.input = { 
        titulo: titulo.trim(), 
        isbn: cleanIsbn, 
        anio_publicacion: yearInt, 
        edicion: edicion?.trim(), 
        autor_id 
    };
    next();
};

const validateIdParam = (req, res, next) => {
    if (isNaN(req.params.id)) {
        const error = new Error('ID no válido');
        error.status = 400;
        return next(error);
    }
    next();
};

module.exports = { validateLibroData, validateIdParam };