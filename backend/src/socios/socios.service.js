const prisma = require('../config/prisma');

const crearSocioService = async (datosSocio, usuarioId) => {
  const { nombre, apellido, documento, telefono, email, fechaNacimiento } = datosSocio;

  const socioExistente = await prisma.socio.findUnique({
    where: { documento }
  });

  if (socioExistente) {
    const error = new Error("Ya existe un socio con ese documento");
    error.status = 409;
    throw error;
  }

  const nuevoSocio = await prisma.socio.create({
    data: {
      nombre,
      apellido,
      documento,
      telefono,
      email: email || null,
      fechaNacimiento: new Date(fechaNacimiento),
      estado: 'ACTIVO',
      creadoPorId: usuarioId
    }
  });

  return nuevoSocio;
};

module.exports = { crearSocioService };