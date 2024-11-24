const http = require('http'); // Para crear el servidor HTTP
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
<<<<<<< HEAD
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
=======
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Crear servidor HTTP compartido
const io = socketIo(server, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3000;
const users = {};

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('images'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Rutas de autenticación
app.use('/api', authRoutes);

// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    // Enviar un mensaje inicial al cliente
    socket.emit('chat-message', 'hello world');

    // Manejar nuevos usuarios
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    // Manejar mensajes de chat
    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });

    // Manejar desconexiones
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
>>>>>>> b145dee64ad9abb45af4e6027a13c1c99641f33a
});
