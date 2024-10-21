const multer = require('multer');
const path = require('path');

// Tipos MIME permitidos para imágenes
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/')); // Guardar en src/uploads/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Asigna un nombre único al archivo
  }
});

// Función para filtrar los archivos que no sean imágenes
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Acepta el archivo
  } else {
    console.log('Tipo de archivo no permitido');
    req.fileValidationError = 'Solo se permiten archivos de imagen (jpeg, png, gif)'; // Establece el mensaje de error en req
    cb(null, false); // Rechaza el archivo
  }
};

// Inicializa multer con la configuración de almacenamiento y el filtro
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
});

// Exportar la configuración de multer
module.exports = { 
  upload
};
