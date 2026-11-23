const validarDatosSocio = (data) => {
  const { nombre, apellido, documento, telefono, email, fechaNacimiento } = data || {};
  
  if (!nombre || !apellido || documento === undefined || !telefono || !fechaNacimiento) {
    return "Faltan campos obligatorios: nombre, apellido, documento, telefono y fechaNacimiento son requeridos.";
  }

  if(typeof nombre !== 'string' || nombre.trim() === '' || typeof apellido !== 'string' || apellido.trim() === ''){
    return "El nombre y apellido deben ser del tipo texto y no pueden estar vacías.";
  }

  if (typeof documento !== 'string' || documento.trim() === ''){
    return "El documento debe ser del tipo texto y NO estar vacía";
  }

  if(isNaN(Date.parse(fechaNacimiento))){
    return "El formato de la fecha de nacimiento no es válido, usar: AAAA-MM-DD";
  }

  if(email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))){
    return "El formato de correo electrónico no es válido"
  }
  
  return null;
};

const validarActualizacionSocio = (id, data) => {
  const idNumerico = Number(id);
  if (!id || !Number.isInteger(idNumerico) || idNumerico <= 0) {
    return "El ID del socio debe ser un número entero válido.";
  }

  const cuerpo = data || {};
  if (Object.keys(cuerpo).length === 0) {
    return "Debe enviar al menos un campo para actualizar.";
  }

  const { nombre, apellido, telefono, email, fechaNacimiento } = cuerpo;

  if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
    return "El nombre debe ser del tipo texto y no puede estar vacío.";
  }

  if (apellido !== undefined && (typeof apellido !== 'string' || apellido.trim() === '')) {
    return "El apellido debe ser del tipo texto y no puede estar vacío.";
  }

  if (telefono !== undefined && (typeof telefono !== 'string' || telefono.trim() === '')) {
    return "El teléfono debe ser del tipo texto y no puede estar vacío.";
  }

  if (fechaNacimiento !== undefined && isNaN(Date.parse(fechaNacimiento))) {
    return "El formato de la fecha de nacimiento no es válido, usar: AAAA-MM-DD";
  }

  if (email !== undefined && email !== null && email !== '' && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
    return "El formato de correo electrónico no es válido";
  }

  return null;
};

module.exports = { validarDatosSocio, validarActualizacionSocio };