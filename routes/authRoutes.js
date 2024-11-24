const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  
const userController = require('../controllers/userController');
const db = require('../config/db'); // Conexión a la base de datos


// Ruta para iniciar sesión
router.post('/login', authController.login);

router.post('/register', async (req, res) => {
    const { email, password, nombre, birthdate, rol } = req.body; // Asegúrate de incluir todos los campos

    try {
        const newUser = await userController.createUser(email, password, nombre, birthdate, rol);
        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message }); // Enviar mensaje de error más detallado
    }
});



// Ruta para obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await userController.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
});

// Ruta para obtener un usuario por email
router.get('/users/:email', async (req, res) => {
    try {
        const user = await userController.getUserByEmail(req.params.email);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo usuario' });
    }
});

// Ruta para eliminar un usuario
router.delete('/users/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await userController.deleteUser(email);
        if (user) {
            res.status(200).json({ message: 'Usuario eliminado', user });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
});

// Obtener perfil de usuario
router.get('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Consulta la información del usuario
        const resultado = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (resultado.rows.length > 0) {
            res.json(resultado.rows[0]);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Actualizar la descripción del usuario
router.put('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        // Actualizar la descripción en la base de datos
        await db.query('UPDATE usuarios SET descripcion = $1 WHERE id = $2', [descripcion, id]);

        res.json({ message: 'Descripción actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la descripción:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Buscar usuarios
router.get('/buscarUsuarios', async (req, res) => {
    const { query } = req.query;

    try {
        // Realizar búsqueda en la base de datos usando el nombre proporcionado
        const result = await db.query(
            `SELECT * FROM usuarios WHERE nombre ILIKE $1`, 
            [`%${query}%`]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron usuarios' });
        }
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});



module.exports = router;
