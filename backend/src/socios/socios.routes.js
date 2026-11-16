const express = require('express');
const router = express.Router();
const { registrarSocio, darDeBajaSocio } = require('./socios.controller');
const { verificarToken, requiereRol } = require('../auth/auth.middleware');

router.post('/', verificarToken, requiereRol('ADMIN'), registrarSocio);
router.patch('/:id/baja', verificarToken, requiereRol('ADMIN'), darDeBajaSocio);

module.exports = router;