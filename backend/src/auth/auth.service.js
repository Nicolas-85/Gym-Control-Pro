const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const loginUsuario = async (email, password)=>{
    const usuario = await prisma.usuario.findUnique({
        where: {email: email.trim().toLowerCase()},
    });

    if (!usuario) {
        const error = new Error('Usuario o contraseña incorrecto');
        error.statusCode = 401;
        throw error;
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if(!passwordValida){
        const error = new Error('Usuario o contraseña incorrecto');
        error.statusCode = 401;
        throw error;
    }

    if(!usuario.activo){
        const error = new Error('Usuario inactivo. Contacte al Administrador');
        error.statusCode = 403;
        throw error;
    }

    const secretKey = process.env.JWT_SECRET;
    if(!secretKey){
        throw new Error("JWT_SECRET no está configurado en las variables de entorno");
    }
    const token = jwt.sign(
        {
            id: usuario.id,
            rol: usuario.rol
        },
        secretKey,
        {expiresIn: '8h'}
    );
    return {
        token, 
        usuario:{
            nombre: usuario.nombre,
            rol: usuario.rol
        },
    };
};

module.exports = {
    loginUsuario,
};