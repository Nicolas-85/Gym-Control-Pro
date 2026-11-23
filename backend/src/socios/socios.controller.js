const { crearSocioService, darDeBajaSocioService, actualizarSocioService } = require('./socios.service');
const { validarDatosSocio, validarActualizacionSocio } = require('./socios.validation');

const registrarSocio = async (req, res) => {
  try {
    const errorValidacion = validarDatosSocio(req.body);
    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

  
    const usuarioId = req.usuario.id; 
    const nuevoSocio = await crearSocioService(req.body, usuarioId);

    return res.status(201).json({
      mensaje: "Socio registrado exitosamente",
      socio: nuevoSocio
    });

  } catch (error) {
    console.error("Error al registrar socio:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Error interno del servidor" });
  }
};

const modificarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    const errorValidacion = validarActualizacionSocio(id, req.body);
    if(errorValidacion){
      return res.status(400).json({error: errorValidacion});
    }
    
    const socioActualizado = await actualizarSocioService(id, req.body);

    return res.status(200).json({
      mensaje: "Socio actualizado exitosamente",
      socio: socioActualizado
    });
  } catch (error) {
    console.error("Error al modificar socio:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Error interno del servidor" });
  }
};

const darDeBajaSocio = async (req, res)=>{
  try{
    const {id} = req.params;
    const resultado = await darDeBajaSocioService(id);

    if(resultado.yaInactivo){
      return res.status(200).json({
        mensaje: 'El socio ya se encuentra inactivo'
      });
    }
    return res.status(200).json({
      mensaje: 'Socio desactivado exitosamente',
      socio: resultado.socio
    });
  } catch (error) {
    console.error('Error al dar de baja el socio: ', error);
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || 'Error interno del servidor'
    });
  }  
};

module.exports = {
  registrarSocio,
  darDeBajaSocio,
  modificarSocio
};
