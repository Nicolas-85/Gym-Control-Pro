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

module.exports = { validarDatosSocio };