const prisma = require('../config/prisma');
const { calcularEstadoCuota } = require('../utils/date.helper');

const registrarIngresoSocio = async (documento, usuarioId) => {
  const socio = await prisma.socio.findUnique({
    where: { documento: String(documento).trim() },
  });

  if (!socio) {
    const error = new Error('Socio no registrado.');
    error.statusCode = 404;
    throw error;
  }

  const estadoCuotaCalculado = calcularEstadoCuota(
    socio.fechaVencimientoCuota,
    socio.ultimaFrecuenciaPago
  );

  await prisma.ingreso.create({
    data: {
      socioId: socio.id,
      usuarioId: usuarioId,
      estadoSocioAlIngresar: socio.estado,
      estadoCuotaAlIngresar: estadoCuotaCalculado,
    },
  });

  const avisos = [];
  if (socio.estado === 'INACTIVO') {
    avisos.push('Socio inactivo.');
  }
  if (estadoCuotaCalculado === 'VENCIDO') {
    avisos.push('Cuota vencida.');
  } else if (estadoCuotaCalculado === 'PROXIMO_A_VENCER') {
    avisos.push('Cuota próxima a vencer.');
  }

  const mensaje =
    avisos.length === 0
      ? 'Ingreso registrado correctamente.'
      : `Ingreso registrado – ${avisos.join(' ')}`;

  return {
    nombre: socio.nombre,
    apellido: socio.apellido,
    estadoSocio: socio.estado,
    estadoCuota: estadoCuotaCalculado,
    mensaje,
  };
};

module.exports = { registrarIngresoSocio };