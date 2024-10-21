const { validationResult } = require("express-validator");

// Función para manejar los errores de validación
/* exports.handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            validation: false, 
            errors: errors.array()
        });
    }
    return null;
}; */

exports.handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      validation: false,
      status: false,
      errors: errors.array(),
    });
    return true;
  }
  return false;
};
