import axios from 'axios';

// URL base de la API del backend
const API_BASE = 'http://localhost:3001/api/zoho';

/**
 * Obtiene todos los productos Epson desde el backend (método original mejorado)
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

/**
 * Obtiene TODOS los productos Epson usando scraping inteligente completo
 * Método más exhaustivo pero más lento
 * 
 * @returns Promise<any> - Datos completos de productos Epson
 */
export const obtenerProductosInteligente = async () => {
  try {
    const response = await axios.get(`${API_BASE}/productos/inteligente`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos con scraping inteligente:', error);
    throw error;
  }
};

/**
 * Obtiene productos Epson usando búsqueda por términos múltiples
 * Método más rápido y eficiente
 * 
 * @returns Promise<any> - Datos de productos encontrados por términos
 */
export const obtenerProductosPorBusqueda = async () => {
  try {
    const response = await axios.get(`${API_BASE}/productos/busqueda`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos por búsqueda:', error);
    throw error;
  }
};

/**
 * Obtiene productos filtrados por categoría específica
 * 
 * @param {string} categoria - Categoría a filtrar (TINTAS_CARTUCHOS, PROYECTORES, etc.)
 * @returns Promise<any> - Datos de productos de la categoría especificada
 */
export const obtenerProductosPorCategoria = async (categoria) => {
  try {
    const response = await axios.get(`${API_BASE}/productos/categoria/${categoria}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos de categoría ${categoria}:`, error);
    throw error;
  }
};

/**
 * Lista de categorías disponibles para filtrado
 */
export const CATEGORIAS_DISPONIBLES = [
  'TINTAS_CARTUCHOS',
  'PROYECTORES', 
  'IMPRESORAS',
  'MULTIFUNCIONALES',
  'SCANNERS',
  'CABEZALES',
  'FUSORES',
  'TAMBORES',
  'RODILLOS',
  'ACCESORIOS',
  'OTROS_COMPONENTES'
];
