const { Pool } = require('pg');

const pool = new Pool({
    host: 'dpg-cs1jkc88fa8c73d10ilg-a.oregon-postgres.render.com', // Cambia esto por el hostname de tu base de datos
    user: 'bd_ayudantia_user', // Cambia esto por tu usuario
    password: '8DVYC71IN845NLt4NXjiriqiUpJLwTCi', // Cambia esto por tu contraseña
    database: 'bd_ayudantia', // Cambia esto por el nombre de tu base de datos
    port: 5432, // Puerto por defecto para PostgreSQL
    ssl: {
        rejectUnauthorized: false, // Cambia a false para conexiones en Render
    },
});

// Función para conectar a la base de datos
async function connectToDatabase() {
    try {
        await pool.connect();
        console.log('Conectado a la base de datos PostgreSQL.');
    } catch (err) {
        console.error('Error conectando a la base de datos: ', err);
    }
}

// Llamar a la función para conectar
connectToDatabase();

module.exports = pool;

// Ruta para obtener las materias de un tutor
app.get('/tutor/:id', async (req, res) => {
    const tutorId = req.params.id;
    try {
      const result = await pool.query(`
        SELECT t.id_tutor AS tutor_id, m.nombre_materia AS materia_nombre
        FROM tutor t
        JOIN materia_tutor mt ON t.id_tutor = mt.tutor_id
        JOIN materias m ON mt.materia_id = m.id_materia
        WHERE t.id_tutor = 1
      `, [tutorId]);
      res.json(result.rows); // Enviar los datos en formato JSON al frontend
    } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
    }
  });
