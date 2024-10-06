// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');  // Importar express-validator
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');

// Rutas CRUD protegidas
router.get('/', userController.getAllUsers);   // Obtener todos los usuarios

router.get('/:id', 
    authenticateToken,  // Proteger esta ruta
    param('id').isNumeric().withMessage('El ID debe ser un número'), 
    userController.getUserById);  // Obtener un usuario por ID

router.post('/', upload.single('image'), [
    body('name').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').isStrongPassword().withMessage('Coloca un password más fuerte'),
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