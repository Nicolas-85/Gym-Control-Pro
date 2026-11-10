const express = require('express');
const router = express.Router();
const { registrarSocio } = require('./socios.controller');

router.post('/', registrarSocio);

module.exports = router;