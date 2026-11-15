const prisma = require('../config/prisma');

const crearSocioService = async (datosSocio, usuarioId) => {
  const { nombre, apellido, documento, telefono, email, fechaNacimiento } = datosSocio;
  const documentoLimpio = documento.trim();

  const socioExistente = await prisma.socio.findUnique({
    where: { documento: documentoLimpio }
  });

  if (socioExistente) {
    const error = new Error("Ya existe un socio con ese documento");
    error.status = 409;
    throw error;
  }

  const nuevoSocio = await prisma.socio.create({
    data: {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      documento: documentoLimpio,
      telefono: String(telefono).trim(),
      email: email ? email.trim() : null,
      fechaNacimiento: new Date(fechaNacimiento),
      estado: 'ACTIVO',
      creadoPorId: usuarioId
    }
  });

  return nuevoSocio;
};

// 2. Función para modificar un socio (TCK-007)
const actualizarSocioService = async (id, datosActualizados) => {
  const socioExistente = await prisma.socio.findUnique({
    where: { id: Number(id) }
  });

  if (!socioExistente) {
    return null; 
  }

  if (datosActualizados.documento) {
    delete datosActualizados.documento;
  }

  const socioActualizado = await prisma.socio.update({
    where: { id: Number(id) },
    data: datosActualizados
  });

  return socioActualizado;
};

module.exports = { 
  crearSocioService, 
  actualizarSocioService 
};