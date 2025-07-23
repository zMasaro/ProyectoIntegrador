import axios from 'axios';

// URL base de la API del backend
const API_BASE = 'http://localhost:3001/api/zoho';

/**
 * Obtiene todos los productos Epson usando búsqueda optimizada por términos
 * Método más rápido y eficiente para encontrar productos Epson
 * 
 * @returns Promise<any> - Datos de productos Epson desde Zoho Inventory
 * @throws Error si la petición falla
 */
export const obtenerProductosPorBusqueda = async () => {
  try {
    const response = await axios.get(`${API_BASE}/productos/busqueda`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos por búsqueda optimizada:', error);
    throw error;
  }
};
