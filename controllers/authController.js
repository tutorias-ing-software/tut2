const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

// Controlador para iniciar sesión
exports.login = [
    check('email').isEmail().withMessage('Ingrese un correo electrónico válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, nombre } = req.body;

        try {
            // Verificar el usuario en la base de datos
            const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                // Comparar la contraseña proporcionada con la contraseña hasheada en la base de datos
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    // Usuario encontrado
                    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
                } else {
                    // Credenciales incorrectas
                    res.status(401).json({ message: 'Credenciales incorrectas' });
                }
            } else {
                // Usuario no encontrado
                res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } catch (err) {
            console.error('Error en la autenticación:', err);
            res.status(500).json({ message: 'Error en el servidor autenticacion' });
        }
    }
];
