const pool = require('../config/db'); // Conexión a la base de datos

exports.getTopTutors = async (req, res) => {
    try {
        // Realizar la consulta a la base de datos
        const result = await pool.query(`
            SELECT 
                usuarios.nombre AS tutor,
                tutor_materia.especialidad,
                CASE 
                    WHEN CAST(usuarios.rol AS INTEGER) = 0 THEN 'Estudiante'
                    WHEN CAST(usuarios.rol AS INTEGER) = 1 THEN 'Tutor'
                    ELSE 'Desconocido' 
                END AS rol
            FROM 
                usuarios
            INNER JOIN 
                tutor_materia 
            ON 
                usuarios.id = tutor_materia.tutor_id
            WHERE 
                CAST(usuarios.rol AS INTEGER) = 1
            LIMIT 3;
        `);

        // Accedemos a los resultados a través de `result.rows`
        const topTutors = result.rows;

        // Verificamos si hay datos
        if (topTutors.length > 0) {
            res.status(200).json(topTutors); // Si hay tutores, los enviamos como respuesta
        } else {
            res.status(404).json({ message: 'No se encontraron tutores' }); // Si no se encuentran, mostramos un mensaje
        }
    } catch (error) {
        console.error('Error al obtener los tutores:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener los tutores' }); // Manejo de errores
    }
};
