/**
 * Servidor Express para la API de inventario Epson
 * Integración con Zoho Inventory para obtener productos
 * Sistema de renovación automática de tokens de Zoho
 */

// Cargar variables de entorno ANTES de importar otros módulos
import dotenv from 'dotenv';
import path from 'path';

// Configurar dotenv con la ruta correcta al archivo .env en Backend
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import session from "express-session";
import cors from 'cors';
import zohoRoutes from './routes/zoho.routes';
import encryptionRoutes from './routes/encryption.routes';
import { initializeTokenRefresh } from './config/zoho.config';
import loginRoutes from './routes/login.routes';
import registerRoutes from './routes/register.routes';
import adminUserRoutes from "./routes/adminUser.routes";
import logouteRoutes from "./routes/logout.routes";



// Crear instancia de la aplicación Express
const app = express();

// Middlewares
// ✅ Configuración de CORS (solo una vez)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true, // necesario para enviar cookies
  })
);

// ✅ Middleware para parsear JSON
app.use(express.json());

// ✅ Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "NJACOM123", // Clave secreta para firmar la sesión
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hora
      httpOnly: true, // la cookie no es accesible desde JS
      sameSite: "lax", // necesario para CORS con credenciales
    },
  })
);
app.get("/api/check-session", (req, res) => {
  if (req.session?.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

// Rutas de la API

app.use('/api', loginRoutes);
app.use('/api', registerRoutes);
app.use('/api', adminUserRoutes);
app.use('/api', logouteRoutes);

// Puerto del servidor (por defecto 3001)
const PORT = process.env.PORT || 3001;

// Inicializar sistema de renovación automática de tokens
initializeTokenRefresh();

// Middlewares
app.use(cors()); // Habilitar CORS para peticiones del frontend
app.use(express.json()); // Parser para JSON en el body de las peticiones

// Rutas de la API
app.use('/api/zoho', zohoRoutes);

// Rutas para encriptación y comparación del hash
app.use('/api/security', encryptionRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api/zoho/productos`);
});

