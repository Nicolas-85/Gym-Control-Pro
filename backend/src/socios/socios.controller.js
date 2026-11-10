const { crearSocioService } = require('./socios.service');
const { validarDatosSocio } = require('./socios.validation');

const registrarSocio = async (req, res) => {
  try {
    const errorValidacion = validarDatosSocio(req.body);
    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

  
    const usuarioId = req.usuario ? req.usuario.id : 1; 

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

module.exports = { registrarSocio };