const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors'); // Importa cors
const path = require('path'); // Importa path para manejar rutas de archivos
const rateLimit = require('express-rate-limit'); // Importa express-rate-limit

// Crear la aplicación
const app = express();

// Variables de entorno
const PORT = process.env.PORT_HOST || 3000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

// Configurar middleware cors
const allowedOrigins = [frontendUrl, 'http://localhost:5000'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

// Configurar body-parser para procesar JSON con un límite mayor
app.use(bodyParser.json({ limit: '10mb' })); // Ajusta el límite a lo que necesites
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Ajusta el límite a lo que necesites

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar limitador de tasa
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana
});
app.use(limiter); // Aplica el limitador a todas las rutas

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// URL Backend
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
