import { Router } from 'express';
import { getProductos, getProductosInteligente, getProductosPorBusqueda, getProductosPorCategoria, getImageProxy } from '../controllers/zoho.controller';

// Crear instancia del router de Express
const router = Router();

/**
 * Ruta: GET /productos
 * Descripción: Obtiene todos los productos Epson desde Zoho Inventory (método legacy)
 * Respuesta: JSON con lista de productos y metadatos
 */
router.get('/productos', getProductos);

/**
 * Ruta: GET /productos/inteligente
 * Descripción: Obtiene TODOS los productos relacionados con Epson usando scraping inteligente
 * Incluye productos no etiquetados como "epson" pero relacionados (tintas, componentes, etc.)
 * Respuesta: JSON con productos categorizados, imágenes y metadatos enriquecidos
 */
router.get('/productos/inteligente', getProductosInteligente);

/**
 * Ruta: GET /productos/busqueda
 * Descripción: Obtiene productos usando múltiples términos de búsqueda (método más rápido)
 * Busca específicamente por términos relacionados con Epson e impresión
 * Respuesta: JSON con productos únicos encontrados y estadísticas de búsqueda
 */
router.get('/productos/busqueda', getProductosPorBusqueda);

/**
 * Ruta: GET /productos/categoria/:categoria
 * Descripción: Obtiene productos filtrados por categoría específica
 * Parámetros: categoria (TINTAS_CARTUCHOS, PROYECTORES, IMPRESORAS, etc.)
 * Respuesta: JSON con productos de la categoría especificada
 */
router.get('/productos/categoria/:categoria', getProductosPorCategoria);

/**
 * Ruta: GET /imagen/:itemId
 * Descripción: Proxy para servir imágenes de productos Zoho
 * Parámetros: itemId - ID del producto en Zoho
 * Respuesta: Imagen binaria con headers apropiados
 */
router.get('/imagen/:itemId', getImageProxy);

export default router;
