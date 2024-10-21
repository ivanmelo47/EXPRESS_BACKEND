// src/controllers/userController.js
const db = require("../config/knex");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { handleValidationErrors } = require("../utils/validationHelper");
const { handleSuccess, handleError, notFoundResponse, respuestaPersonalizada } = require("../utils/responseHelper");
const { recordExists } = require("../utils/dbHelpers");
const path = require('path');
const { deleteFile } = require('../utils/fileHelper'); // Importar la función deleteFile

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db("users").select(
      "id",
      "uuid",
      "name",
      "email",
      "phone",
      "created_at"
    );

    // Respuesta exitosa
    handleSuccess(res, users);
  } catch (error) {
    // Respuesta de error
    handleError(res, "Error al obtener los usuarios", error);
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  // Verificar errores de validación de los datos de entrada
  if (handleValidationErrors(req, res)) return;

  const { id } = req.params;
  try {
    const user = await db("users").where({ id }).first();

    // Respuesta de recurso no encontrado
    if (!user) return notFoundResponse(res, "Usuario no encontrado");

    // Respuesta exitosa
    handleSuccess(res, user);
  } catch (error) {
    // Respuesta de error
    handleError(res, "Error al obtener el usuario", error);
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  // Verificar errores de validación
  if (handleValidationErrors(req, res)){
    if (req.file) {
      await deleteFile(path.join(__dirname, '../uploads/', req.file.filename));
    }
    return;
  };

  // Crear el usuario
  const { name, email, phone, password } = req.body;
  const uuid = uuidv4(); // Genera el UUID
  const hashedPassword = await bcrypt.hash(password, 10); // Hashea el password

  // Obtener la URL de la imagen
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Verificar si el email o teléfono ya existen
    const [emailExists, phoneExists] = await Promise.all([
      recordExists("users", "email", email),
      recordExists("users", "phone", phone),
    ]);

    if (emailExists) {
      if (req.file) {
        await deleteFile(path.join(__dirname, '../uploads/', req.file.filename));
      }
      return respuestaPersonalizada(res, "El email ya está en uso", false, false, null, 409);
    }

    if (phoneExists) {
      if (req.file) {
        await deleteFile(path.join(__dirname, '../uploads/', req.file.filename));
      }
      return respuestaPersonalizada(res, "El telefono ya está en uso", false, false, null, 409);
    }

    const [userId] = await db("users").insert({
      uuid,
      name,
      email,
      phone,
      password: hashedPassword,
      url_img: imageUrl
    });

    // Respuesta exitosa
    handleSuccess(res, { userId, uuid }, "Usuario creado", 201);
  } catch (error) {
    // Respuesta de error
    handleError(res, "Error al crear el usuario", error);
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  // Verificar errores de validación
  if (handleValidationErrors(req, res)) return;

  const { id } = req.params;
  const { name, email, phone, password } = req.body;

  // Solo hashea el password si se ha proporcionado un nuevo password
  const updatedData = {
    name,
    email,
    phone,
  };

  if (password) {
    updatedData.password = await bcrypt.hash(password, 10); // Hashea el nuevo password
  }

  try {
    const updatedRows = await db("users").where({ id }).update(updatedData);
    if (updatedRows === 0)
      return notFoundResponse(res, "Usuario no encontrado");
    handleSuccess(res, null, "Usuario actualizado");
  } catch (error) {
    handleError(res, "Error al actualizar el usuario", error);
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  // Verificar errores de validación
  //const validationErrors = handleValidationErrors(req, res);
  //if (validationErrors) return validationErrors;
  if (handleValidationErrors(req, res)) return;

  const { id } = req.params;
  try {
    const deletedRows = await db("users").where({ id }).del();

    // Respuesta de recurso no encontrado
    if (deletedRows === 0)
      return notFoundResponse(res, "Usuario no encontrado");

    // Respuesta exitosa
    handleSuccess(res, null, "Usuario eliminado");
  } catch (error) {
    // Respuesta de error
    handleError(res, "Error al eliminar el usuario", error);
  }
};
