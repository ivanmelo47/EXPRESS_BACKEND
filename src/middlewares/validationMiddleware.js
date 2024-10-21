// validationMiddleware.js
const { body } = require('express-validator');

const userValidationRules = () => {
  return [
    body('name')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email')
      .isEmail()
      .withMessage('Debe ser un correo válido'),
    body('password')
      .isStrongPassword()
      .withMessage('Coloca un password más fuerte'),
  ];
};

// Puedes agregar otras validaciones aquí para otros modelos
module.exports = {
  userValidationRules,
};