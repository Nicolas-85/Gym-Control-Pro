const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./auth/auth.routes');
const sociosRoutes = require('./socios/socios.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/socios', sociosRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
