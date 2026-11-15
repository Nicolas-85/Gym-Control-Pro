const express = require('express');
const router = express.Router();
const { registrarIngreso } = require('./ingresos.controller');
const { verificarToken } = require('../auth/auth.middleware'); 

router.post('/', verificarToken, registrarIngreso);

module.exports = router;