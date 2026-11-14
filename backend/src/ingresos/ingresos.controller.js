const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calcularEstadoCuota } = require('../utils/dateHelpers');

const registrarIngreso = async (req, res) => {
  try {
    const { documento } = req.body;
    const usuarioId = req.usuario.id;

    if (!documento) {
      return res.status(400).json({ error: 'El número de documento es obligatorio.' });
    }

    // Paso 1: Buscar al socio
    const socio = await prisma.socio.findUnique({
      where: { documento: String(documento).trim() }
    });

    if (!socio) {
      return res.status(404).json({ error: 'Socio no registrado.' });
    }

    // Paso 2: Calcular el estado de la cuota
    const estadoCuotaCalculado = calcularEstadoCuota(
      socio.fechaVencimientoCuota,
      socio.ultimaFrecuenciaPago
    );

    // Paso 3: Crear el registro de Ingreso (congelando la foto)
    await prisma.ingreso.create({
      data: {
        socioId: socio.id,
        usuarioId: usuarioId,
        estadoSocioAlIngresar: socio.estado,
        estadoCuotaAlIngresar: estadoCuotaCalculado
      }
    });

    // Paso 4: Armar el mensaje de respuesta
    const avisos = [];

    if (socio.estado === 'INACTIVO') {
      avisos.push('Socio inactivo.');
    }

    if (estadoCuotaCalculado === 'VENCIDO') {
      avisos.push('Cuota vencida.');
    } else if (estadoCuotaCalculado === 'PROXIMO_A_VENCER') {
      avisos.push('Cuota próxima a vencer.');
    }

    let mensaje = '';
    if (avisos.length === 0) {
      mensaje = 'Ingreso registrado correctamente.';
    } else {
      mensaje = `Ingreso registrado – ${avisos.join(' ')}`;
    }

    return res.status(201).json({
      nombre: socio.nombre,
      apellido: socio.apellido,
      estadoSocio: socio.estado,
      estadoCuota: estadoCuotaCalculado,
      mensaje: mensaje
    });

  } catch (error) {
    console.error('Error al registrar ingreso:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { registrarIngreso };