function calcularEstadoCuota(fechaVencimientoCuota, ultimaFrecuenciaPago) {
  if (!fechaVencimientoCuota) {
    return 'VENCIDO';
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaVenc = new Date(fechaVencimientoCuota);
  fechaVenc.setHours(0, 0, 0, 0);

  if (fechaVenc < hoy) {
    return 'VENCIDO';
  }

  const diferenciaMs = fechaVenc.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  let diasProximoAVencer = 0;
  switch (ultimaFrecuenciaPago) {
    case 'SEMANAL':
      diasProximoAVencer = 1;
      break;
    case 'QUINCENAL':
      diasProximoAVencer = 3;
      break;
    case 'MENSUAL':
      diasProximoAVencer = 5;
      break;
    case 'DIARIO':
    default:
      diasProximoAVencer = 0;
      break;
  }

  if (diasProximoAVencer > 0 && diasRestantes <= diasProximoAVencer) {
    return 'PROXIMO_A_VENCER';
  }

  return 'VIGENTE';
}

module.exports = { calcularEstadoCuota };