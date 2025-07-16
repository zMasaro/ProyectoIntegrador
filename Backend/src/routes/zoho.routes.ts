import { Router } from 'express';
import { getProductos } from '../controllers/zoho.controller';

// Crear instancia del router de Express
const router = Router();

/**
 * Ruta: GET /productos
 * Descripción: Obtiene todos los productos Epson desde Zoho Inventory
 * Respuesta: JSON con lista de productos y metadatos
 */
router.get('/productos', getProductos);

export default router;
