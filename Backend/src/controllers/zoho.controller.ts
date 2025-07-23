import { Request, Response } from 'express';
import { ZohoService } from '../services/zoho.service';

// Instancia del servicio Zoho para interactuar con la API
const zohoService = new ZohoService();

/**
 * Controlador para obtener todos los productos Epson desde Zoho Inventory (método legacy)
 * Maneja la petición HTTP y retorna los productos en formato JSON
 * 
 * @param _req - Objeto Request de Express (no utilizado en esta implementación)
 * @param res - Objeto Response de Express para enviar la respuesta
 */
export const getProductos = async (_req: Request, res: Response) => {
  try {
    // Obtener todos los productos Epson utilizando el servicio legacy
    const data = await zohoService.getAllEpsonItems();
    
    // Enviar respuesta exitosa con los datos obtenidos
    res.json(data);
  } catch (error: any) {
    // Log del error para debugging interno
    console.error('Error en controlador Zoho:', error.response?.data || error.message);
    
    // Determinar el código de estado HTTP apropiado
    const statusCode = error.response?.status || 500;
    
    // Extraer mensaje de error legible para el cliente
    const errorMessage = error.response?.data?.message || 'Error al consultar Zoho Inventory';
    
    // Enviar respuesta de error estructurada
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.response?.data || error.message 
    });
  }
};

/**
 * Controlador para scraping inteligente de productos Epson
 * Obtiene TODOS los productos relacionados con Epson, incluyendo los no etiquetados
 * 
 * @param _req - Objeto Request de Express
 * @param res - Objeto Response de Express para enviar la respuesta
 */
export const getProductosInteligente = async (_req: Request, res: Response) => {
  try {
    console.log('Iniciando scraping inteligente de productos Epson...');
    
    // Obtener productos usando análisis inteligente
    const data = await zohoService.getAllEpsonItems();
    
    // Agregar metadatos de tiempo de procesamiento
    const response = {
      ...data,
      timestamp: new Date().toISOString(),
      processing_method: 'intelligent_scraping',
      description: 'Productos obtenidos mediante análisis inteligente de TODO el inventario'
    };
    
    console.log(`Scraping inteligente completado: ${data.total_items} productos encontrados`);
    res.json(response);
    
  } catch (error: any) {
    console.error('Error en scraping inteligente:', error.response?.data || error.message);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Error durante el scraping inteligente';
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.response?.data || error.message,
      processing_method: 'intelligent_scraping'
    });
  }
};

/**
 * Controlador para búsqueda por términos múltiples
 * Método más rápido que busca específicamente por términos relacionados
 * 
 * @param _req - Objeto Request de Express
 * @param res - Objeto Response de Express para enviar la respuesta
 */
export const getProductosPorBusqueda = async (_req: Request, res: Response) => {
  try {
    console.log('Iniciando búsqueda por términos múltiples...');
    
    // Obtener productos usando búsqueda por términos
    const data = await zohoService.getEpsonItemsBySearch();
    
    // Agregar metadatos
    const response = {
      ...data,
      timestamp: new Date().toISOString(),
      processing_method: 'multi_term_search',
      description: 'Productos obtenidos mediante búsqueda por múltiples términos específicos'
    };
    
    console.log(`Búsqueda por términos completada: ${data.total_items} productos únicos encontrados`);
    res.json(response);
    
  } catch (error: any) {
    console.error('Error en búsqueda por términos:', error.response?.data || error.message);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Error durante la búsqueda por términos';
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.response?.data || error.message,
      processing_method: 'multi_term_search'
    });
  }
};

/**
 * Controlador para obtener productos por categoría específica
 * Filtra productos ya obtenidos por una categoría específica
 * 
 * @param req - Objeto Request de Express (contiene parámetro de categoría)
 * @param res - Objeto Response de Express para enviar la respuesta
 */
export const getProductosPorCategoria = async (req: Request, res: Response) => {
  try {
    const { categoria } = req.params;
    
    console.log(`Obteniendo productos de la categoría: ${categoria}`);
    
    // Obtener todos los productos usando scraping inteligente
    const allData = await zohoService.getAllEpsonItems();
    
    // Validar que la categoría existe
    const validCategories = [
      'TINTAS_CARTUCHOS', 'PROYECTORES', 'IMPRESORAS', 'MULTIFUNCIONALES',
      'SCANNERS', 'CABEZALES', 'FUSORES', 'TAMBORES', 'RODILLOS', 
      'ACCESORIOS', 'OTROS_COMPONENTES'
    ];
    
    const upperCategoria = categoria.toUpperCase();
    
    if (!validCategories.includes(upperCategoria)) {
      return res.status(400).json({
        error: 'Categoría inválida',
        valid_categories: validCategories,
        provided_category: categoria
      });
    }
    
    // Filtrar productos por categoría
    const categoryItems = allData.categories[upperCategoria] || [];
    
    const response = {
      code: 0,
      message: "success",
      category: upperCategoria,
      items: categoryItems,
      total_items: categoryItems.length,
      timestamp: new Date().toISOString(),
      processing_method: 'category_filter',
      available_categories: allData.categories.stats
    };
    
    console.log(`Productos de categoría ${upperCategoria}: ${categoryItems.length} encontrados`);
    res.json(response);
    
  } catch (error: any) {
    console.error('Error obteniendo productos por categoría:', error.response?.data || error.message);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Error al filtrar productos por categoría';
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.response?.data || error.message,
      processing_method: 'category_filter'
    });
  }
};

/**
 * Controlador proxy para servir imágenes de productos Zoho
 * Permite al frontend acceder a las imágenes sin autenticación directa
 * 
 * @param req - Objeto Request de Express (contiene item_id)
 * @param res - Objeto Response de Express para enviar la imagen
 */
export const getImageProxy = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    if (!itemId) {
      return res.status(400).json({
        error: 'Item ID requerido',
        message: 'Debes proporcionar un item_id para obtener la imagen'
      });
    }

    console.log(`Obteniendo imagen para producto: ${itemId}`);
    
    // Obtener la imagen usando el servicio Zoho
    const imageData = await zohoService.getProductImage(itemId);
    
    if (!imageData) {
      return res.status(404).json({
        error: 'Imagen no encontrada',
        message: `No se encontró imagen para el producto ${itemId}`
      });
    }

    // Establecer headers apropiados para la imagen
    res.setHeader('Content-Type', imageData.contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora
    
    // Enviar los datos de la imagen
    res.send(imageData.data);
    
  } catch (error: any) {
    console.error('Error en proxy de imagen:', error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Error al obtener la imagen';
    
    res.status(statusCode).json({
      error: errorMessage,
      details: error.response?.data || error.message,
      item_id: req.params.itemId
    });
  }
};
