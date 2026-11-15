const { crearSocioService, actualizarSocioService } = require('./socios.service');
const { validarDatosSocio } = require('./socios.validation');

// 1. Controlador para el alta (TCK-006)
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

// 2. Controlador para la modificación (TCK-007)
const modificarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const socioActualizado = await actualizarSocioService(id, datosActualizados);

    if (!socioActualizado) {
      return res.status(404).json({ error: "Socio no encontrado" });
    }

    return res.status(200).json({
      mensaje: "Socio actualizado exitosamente",
      socio: socioActualizado
    });
  } catch (error) {
    console.error("Error al modificar socio:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  registrarSocio,
  modificarSocio
};