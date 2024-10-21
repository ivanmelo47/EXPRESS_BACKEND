const fs = require('fs');
const path = require('path');

// Función para eliminar archivos
const deleteFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath); // Elimina el archivo
    console.log(`Archivo eliminado: ${filePath}`);
  } catch (err) {
    console.error(`Error al eliminar el archivo: ${filePath}`, err);
  }
};

module.exports = { deleteFile };