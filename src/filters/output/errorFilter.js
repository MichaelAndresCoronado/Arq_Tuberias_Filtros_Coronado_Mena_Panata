const globalErrorHandler = (err, req, res, next) => {
    console.error('🚨 Error en la tubería:', err.message || err);

    // Guardamos el error en nuestro contexto estándar por si queremos auditarlo después
    if (req.pipeline) {
        req.pipeline.error = err;
    }

    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        error: {
            code: statusCode,
            message: errorMessage
        }
    });
};

module.exports = globalErrorHandler;