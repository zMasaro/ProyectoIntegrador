import axios from 'axios';

// URL base de la API del backend
const API_BASE = 'http://localhost:3001/api/zoho';

/**
 * Obtiene todos los productos Epson desde el backend
 * 
 * @returns Promise<any> - Datos de productos Epson desde Zoho Inventory
 * @throws Error si la petición falla
 */
export const obtenerProductos = async () => {
  try {
    const response = await axios.get(`${API_BASE}/productos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};
