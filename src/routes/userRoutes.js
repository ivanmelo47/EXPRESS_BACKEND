// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');  // Importar express-validator
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/multer');
const fileValidationMiddleware = require('../middlewares/fileValidationMiddleware'); // Importa tu middleware
const { userValidationRules } = require('../middlewares/validationMiddleware'); // Importa tu middleware de validación

// Rutas CRUD protegidas
router.get('/', userController.getAllUsers);   // Obtener todos los usuarios

router.get('/:id', 
    authenticateToken,  // Proteger esta ruta
    param('id').isNumeric().withMessage('El ID debe ser un número'), 
    userController.getUserById);  // Obtener un usuario por ID

router.post('/',
    /* authenticateToken,  */
    upload.single('image'),
    fileValidationMiddleware, [
    userValidationRules(),
], userController.createUser);  // Crear usuario (No protegido si es para registro)

router.put('/:id', [
    authenticateToken,  // Proteger esta ruta
    param('id').isNumeric().withMessage('El ID debe ser un número'),
    body('name').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email').optional().isEmail().withMessage('Debe ser un correo válido')
], userController.updateUser);  // Actualizar usuario

router.delete('/:id', 
    authenticateToken,  // Proteger esta ruta
    param('id').isNumeric().withMessage('El ID debe ser un número'), 
    userController.deleteUser);  // Eliminar un usuario

module.exports = router;