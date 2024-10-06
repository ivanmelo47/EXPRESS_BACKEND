// middleware/logger.js
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    /* console.log('Request Body:', req.body);
    console.log('Query Params:', req.query);
    console.log('Params:', req.params); */
    next(); // Pasa al siguiente middleware o ruta
};

module.exports = logger;