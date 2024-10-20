// middleware/auth.js
module.exports = (req, res, next) => {
    if (req.session.user) {
        next(); // Si hay un usuario en la sesión, continuar
    } else {
        res.status(401).json({ message: 'No autorizado' }); // Si no, enviar un error 401
    }
};