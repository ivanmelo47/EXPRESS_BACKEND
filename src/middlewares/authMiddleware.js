const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
  // Obtener el token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // El token se espera como 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ msg: 'Acceso denegado. No se proporcionó un token.' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: 'Token no válido.' });
    }

    // Agregar el usuario a la solicitud
    req.user = user;
    next(); // Continuar al siguiente middleware o controlador
  });
};

module.exports = authenticateToken;