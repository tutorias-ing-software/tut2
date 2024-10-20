const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Añadido para manejar el cuerpo de las solicitudes
const authRoutes = require('./routes/authRoutes'); // Asegúrate de que la ruta es correcta
const db = require('./config/db'); // Importa tu conexión a la base de datos

const app = express();

//app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000' // Permite solicitudes desde localhost:3000
}));

app.use(express.json()); // Para manejar JSON en las solicitudes
app.use(bodyParser.urlencoded({ extended: true })); // Para manejar formularios URL-encoded

// Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));
app.use(express.static('images'));


// Definir la ruta para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Cambia la ruta al archivo index.html
});

const PORT = process.env.PORT || 3000;

// Usar las rutas de autenticación
app.use('/api', authRoutes);

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
