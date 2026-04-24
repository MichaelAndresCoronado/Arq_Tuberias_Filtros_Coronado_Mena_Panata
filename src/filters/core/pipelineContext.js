
const initializePipeline = (req, res, next) => {
    req.pipeline = {
        // Aquí los filtros de entrada (Integrante 2) pondrán los datos limpios
        input: {}, 
        
        // Aquí los filtros de procesamiento (Integrante 3) pondrán los resultados de la BD
        data: {},  
        
        // Aquí se registrarán los errores si un filtro falla
        error: null, 
        
        // Aquí se armará la respuesta final antes de enviarla
        response: {} 
    };
    next(); // Pasa el flujo al siguiente filtro
};

module.exports = initializePipeline;