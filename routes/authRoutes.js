const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  
const userController = require('../controllers/userController');

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

module.exports = router;
