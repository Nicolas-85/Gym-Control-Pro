const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Importación de rutas (desde src/ingresos/)
const ingresosRoutes = require('./ingresos/ingresos.routes');

// Ruta de chequeo de estado de la API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Registro de endpoints del módulo
app.use('/api/ingresos', ingresosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;