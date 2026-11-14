const {registrarIngresoSocio} = require('./ingresos.service');
// const { calcularEstadoCuota } = require('../utils/dateHelpers');

const registrarIngreso = async (req, res) => {
  try {
    const { documento } = req.body;
    const usuarioId = req.usuario.id;

    if (!documento) {
      return res.status(400).json({ error: 'El número de documento es obligatorio.' });
    }

    const resultado = await registrarIngresoSocio(documento, usuarioId);
    return res.status(201).json(resultado);
  } catch (error){
    if (error.statusCode){
      return res.status(error.statusCode).json({error: error.mensaje});
    }

    console.error('Error no controlado al registrar el ingreso: ', error);
    return res.status(500).json({error: 'Error interno del servidor'});
    
  }
};

module.exports = { registrarIngreso };