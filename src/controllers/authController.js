const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { recordExists } = require('../utils/dbHelpers');
const db = require('../config/knex');

const JWT_SECRET = process.env.JWT_SECRET || 'MAYORNUBLADO12@44'; // Asegúrate de guardar esto en variables de entorno

// Función para realizar el login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const user = await db('users').where('email', email).first();
    if (!user) {
      return res.status(401).json({
        status: false,
        msg: 'Email incorrecto'
      });
    }

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        msg: 'Contraseña incorrecta'
      });
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      status: true,
      token: token,
      userId: user.id,
      name: user.name,
      rol: user.rol ?? 'empleado',
      url_img: user.url_img,
      msg: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: 'Error en el servidor' });
  }
};