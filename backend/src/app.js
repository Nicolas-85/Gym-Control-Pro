const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./auth/auth.routes');
const ingresosRoutes = require('./ingresos/ingresos.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de chequeo de estado de la API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Registro de endpoints por módulo
app.use('/api/auth', authRoutes);
app.use('/api/ingresos', ingresosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;