const express = require('express');
const router = express.Router();
const { registrarSocio } = require('./socios.controller');
const { verificarToken, requiereRol } = require('../auth/auth.middleware');

router.post('/', verificarToken, requiereRol('ADMIN'), registrarSocio);

module.exports = router;