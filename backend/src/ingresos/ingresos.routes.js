const express = require('express');
const router = express.Router();
const { registrarIngreso } = require('./ingresos.controller');
// Ajustá la ruta hacia tu middleware de token si está en src/auth o src/middlewares
const { verificarToken } = require('../auth/auth.middleware'); 

router.post('/', verificarToken, registrarIngreso);

module.exports = router;