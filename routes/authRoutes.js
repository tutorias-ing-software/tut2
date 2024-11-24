const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authController = require('../controllers/authController');  
const userController = require('../controllers/userController');

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para registrar usuarios
router.post('/register', async (req, res) => {
    const { email, password, nombre, birthdate, rol } = req.body;

    try {
        const newUser = await userController.createUser(email, password, nombre, birthdate, rol);
        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
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

// Ruta para obtener un usuario por ID
router.get('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para actualizar la descripción del usuario
router.put('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        await pool.query('UPDATE usuarios SET descripcion = $1 WHERE id = $2', [descripcion, id]);
        res.json({ message: 'Descripción actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la descripción:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para buscar usuarios por nombre o correo
router.get('/buscar', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Término de búsqueda requerido' });
    }

    try {
        const result = await pool.query(
            `SELECT id, nombre, email FROM usuarios WHERE nombre ILIKE $1 OR email ILIKE $1 LIMIT 10`,
            [`%${query}%`]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron usuarios' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error buscando usuarios:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
