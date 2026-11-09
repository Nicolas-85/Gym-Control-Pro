const {loginUsuario} = require('./auth.service');

const login = async (req, res )=>{
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(401).json({error: 'Usuario o contraseña incorrecto'});
        }

        const resultado = await loginUsuario(email, password);
        return res.status(200).json(resultado); 
    }catch (error){
        if (error.statusCode){
            return res.status(error.statusCode).json({error: error.message});
        }

        console.error('Error no controlado en Login:', error);
        return res.status(500).json({error: 'Error interno en el servidor'});
    }
};

module.exports = {
    login,
};