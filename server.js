const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación y usuarios
const db = require('./config/db'); // Configuración de conexión a la base de datos
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Variables de entorno

const app = express(); // Inicializa `app`

const PORT = process.env.PORT || 3000;
const secretKey = process.env.JWT_SECRET; // Llave secreta para JWT

// Middleware
app.use(cookieParser()); // Manejo de cookies
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Configuración de CORS
    credentials: true, // Permite el uso de credenciales como cookies
}));
app.use(express.json()); // Para manejar JSON en solicitudes
app.use(bodyParser.urlencoded({ extended: true })); // Para manejar formularios URL-encoded

// Servir archivos estáticos
app.use(express.static('public'));
app.use(express.static('images'));

// Ruta principal para servir la página inicial
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Asegúrate de que el archivo `index.html` esté en la carpeta `public`
});

// Usar las rutas de autenticación
app.use('/api', authRoutes); // Mapeo de rutas API

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
