const { validate } = require("uuid");

// fileValidationMiddleware.js
const fileValidationMiddleware = (req, res, next) => {
    // Si hay un error de validación de archivo
    if (req.fileValidationError) {
      return res.status(400).json({
        validation: false,
        success: false,
        message: req.fileValidationError // Retorna el mensaje de error
      });
    }
  
    // Si todo está bien, continúa al siguiente middleware
    next();
  };
  
  module.exports = fileValidationMiddleware;  