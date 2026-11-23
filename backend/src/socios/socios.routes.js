const express = require('express');
const router = express.Router();
const { registrarSocio, darDeBajaSocio, modificarSocio } = require('./socios.controller');
const { verificarToken, requiereRol } = require('../auth/auth.middleware');

router.post('/', verificarToken, requiereRol('ADMIN'), registrarSocio);
router.patch('/:id/baja', verificarToken, requiereRol('ADMIN'), darDeBajaSocio);
router.put('/:id', verificarToken, requiereRol('ADMIN'), modificarSocio);

module.exports = router;