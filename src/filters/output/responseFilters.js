const sendSuccessResponse = (req, res, next) => {
    // Código 200 para peticiones OK (GET, PUT, DELETE)
    res.status(200).json({
        success: true,
        data: req.pipeline.response
    });
};

const sendCreatedResponse = (req, res, next) => {
    // Código 201 para recursos creados (POST)
    res.status(201).json({
        success: true,
        data: req.pipeline.response
    });
};

module.exports = {
    sendSuccessResponse,
    sendCreatedResponse
};