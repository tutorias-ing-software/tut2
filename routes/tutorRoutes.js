const express = require('express');
const router = express.Router();
const { getTopTutors } = require('../controllers/tutorController'); // Importa el controlador

// Ruta para obtener los tutores principales
router.get('/top-tutors', getTopTutors);

module.exports = router;
