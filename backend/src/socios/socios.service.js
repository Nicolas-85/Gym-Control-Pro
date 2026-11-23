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

const actualizarSocioService = async (id, datosActualizados) => {
  const socioId = Number(id);

  const socioExistente = await prisma.socio.findUnique({
    where: { id: socioId }
  });

  if (!socioExistente) {
    const error = new Error("Socio no encontrado");
    error.status = 404;
    throw error; 
  }

  const {nombre, apellido, telefono, email, fechaNacimiento} = datosActualizados || {};
  const camposActualizar = {};
  
  if (nombre !== undefined) camposActualizar.nombre = nombre.trim();
  if (apellido !== undefined) camposActualizar.apellido = apellido.trim();
  if (telefono !== undefined) camposActualizar.telefono = telefono.trim();
  if (email !== undefined) camposActualizar.email = email ? email.trim() : null;
  if (fechaNacimiento !== undefined) camposActualizar.fechaNacimiento = new Date(fechaNacimiento);

  if(Object.keys(camposActualizar).length === 0){
    return socioExistente;
  }

  const socioActualizado = await prisma.socio.update({
    where: { id: socioId },
    data: camposActualizar
  });

  return socioActualizado;
};

const darDeBajaSocioService = async (id)=>{
  const socioId = Number(id);

  if(!Number.isInteger(socioId) || socioId <= 0){
    const error = new Error('El id del socio debe ser un número entero válido');
    error.status = 400;
    throw error;
  }

  const socio = await prisma.socio.findUnique({
    where: {id: socioId}
  });

  if(!socio){
    const error = new Error('Socio no encontrado');
    error.status = 404;
    throw error;
  }

  if(socio.estado === 'INACTIVO'){
    return{
      yaInactivo: true,
      socio
    };
  }

  const socioActualizado = await prisma.socio.update({
    where: {id: socioId},
    data: {estado: 'INACTIVO'}
  });

  return{
    yaInactivo: false,
    socio: socioActualizado
  };
};

module.exports = { 
  crearSocioService, 
  darDeBajaSocioService,
  actualizarSocioService 
};