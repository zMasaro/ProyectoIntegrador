import { Request, Response } from 'express';
import { ZohoService } from '../services/zoho.service';

// Instancia del servicio Zoho para interactuar con la API
const zohoService = new ZohoService();

/**
 * Controlador para obtener todos los productos Epson desde Zoho Inventory
 * Maneja la petición HTTP y retorna los productos en formato JSON
 * 
 * @param _req - Objeto Request de Express (no utilizado en esta implementación)
 * @param res - Objeto Response de Express para enviar la respuesta
 */
export const getProductos = async (_req: Request, res: Response) => {
  try {
    // Obtener todos los productos Epson utilizando el servicio
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
