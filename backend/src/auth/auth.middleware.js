const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res.status(401).json({error: 'Acceso denegado. Token no proporcionado'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = {
            id: decoded.id, 
            rol: decoded.rol, 
        };
        next();
    } catch (error) {
        return res.status(401).json({error: 'Token inválido'});
    }
};

const requiereRol = (...roles)=>{
    return (req, res, next)=>{
        if(!req.usuario || !roles.includes(req.usuario.rol)){
            return res.status(403).json({error: 'Acceso denegado. No tenés permiso para realizar esta acción'})
        }
        next();
    };
};

module.exports = {
    verificarToken, 
    requiereRol
};