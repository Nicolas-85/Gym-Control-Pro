const express = require('express');
const router = express.Router();
const { registrarSocio, modificarSocio } = require('./socios.controller');
const { verificarToken, requiereRol } = require('../auth/auth.middleware');

router.post('/', verificarToken, requiereRol('ADMIN'), registrarSocio);

router.put('/:id', verificarToken, requiereRol('ADMIN'), modificarSocio);

module.exports = router;