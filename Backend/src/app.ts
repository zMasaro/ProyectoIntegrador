/**
 * Servidor Express para la API de inventario Epson
 * Integración con Zoho Inventory para obtener productos
 */

// Cargar variables de entorno ANTES de importar otros módulos
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import zohoRoutes from './routes/zoho.routes';

// Crear instancia de la aplicación Express
const app = express();

// Puerto del servidor (por defecto 3001)
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Habilitar CORS para peticiones del frontend
app.use(express.json()); // Parser para JSON en el body de las peticiones

// Rutas de la API
app.use('/api/zoho', zohoRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📋 API disponible en http://localhost:${PORT}/api/zoho/productos`);
});

