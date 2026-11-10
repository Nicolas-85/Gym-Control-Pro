const validarDatosSocio = (data) => {
  const { nombre, apellido, documento, telefono, fechaNacimiento } = data;
  
  if (!nombre || !apellido || !documento || !telefono || !fechaNacimiento) {
    return "Faltan campos obligatorios: nombre, apellido, documento, telefono y fechaNacimiento son requeridos.";
  }
  
  return null;
};

module.exports = { validarDatosSocio };