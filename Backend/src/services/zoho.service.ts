import axios from "axios";
import { getCurrentToken, ZOHO_ORG_ID, ZOHO_INVENTORY_URL, refreshAccessToken } from "../config/zoho.config";

/**
 * Servicio para interactuar con la API de Zoho Inventory
 * Permite obtener productos específicos de Epson desde el inventario
 * Incluye manejo automático de renovación de tokens
 */
export class ZohoService {
  private readonly baseURL = `${ZOHO_INVENTORY_URL}/inventory/v1`;

  /**
   * Realiza una petición HTTP con manejo automático de tokens
   * @param url - URL del endpoint
   * @param config - Configuración adicional de axios
   * @returns Promise con la respuesta de la API
   */
  private async makeAuthenticatedRequest(url: string, config: any = {}) {
    try {
      const token = await getCurrentToken();
      
      const response = await axios.get(url, {
        ...config,
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
          "X-com-zoho-inventory-organizationid": ZOHO_ORG_ID,
          ...config.headers
        }
      });

      return response;
    } catch (error: any) {
      // Si el token expiró (401), intentar renovarlo y reintentar
      if (error.response?.status === 401) {
        console.log('Token expirado, renovando automáticamente...');
        try {
          await refreshAccessToken();
          const newToken = await getCurrentToken();
          
          // Reintentar la petición con el nuevo token
          const response = await axios.get(url, {
            ...config,
            headers: {
              Authorization: `Zoho-oauthtoken ${newToken}`,
              "Content-Type": "application/json",
              "X-com-zoho-inventory-organizationid": ZOHO_ORG_ID,
              ...config.headers
            }
          });

          return response;
        } catch (refreshError) {
          console.error('Error renovando token automáticamente:', refreshError);
          throw refreshError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Obtiene una página de productos Epson desde Zoho Inventory
   * @returns Promise con los datos de la primera página de productos Epson
   */
  async getItems() {
    // Configurar parámetros de búsqueda para filtrar productos Epson
    const searchParams = new URLSearchParams({
      'search_text': 'epson',
      'per_page': '200',  // Máximo permitido por página
      'page': '1'
    });
    
    const response = await this.makeAuthenticatedRequest(`${this.baseURL}/items?${searchParams.toString()}`);
    return response.data;
  }

  /**
   * Obtiene TODOS los productos Epson del inventario usando paginación automática
   * Itera a través de todas las páginas disponibles para obtener el inventario completo
   * @returns Promise con todos los productos Epson encontrados
   */
  async getAllEpsonItems() {
    let allItems: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    
    // Iterar a través de todas las páginas disponibles
    while (hasMore) {
      const searchParams = new URLSearchParams({
        'search_text': 'epson',
        'per_page': '200',
        'page': currentPage.toString()
      });
      
      const response = await this.makeAuthenticatedRequest(`${this.baseURL}/items?${searchParams.toString()}`);
      const data = response.data;
      
      // Procesar los resultados de la página actual
      if (data.items && data.items.length > 0) {
        allItems = allItems.concat(data.items);
        
        // Verificar si hay más páginas disponibles
        if (data.page_context && data.page_context.has_more_page) {
          currentPage++;
        } else {
          hasMore = false;
        }
      } else {
        // No hay más productos, terminar la iteración
        hasMore = false;
      }
    }
    
    // Retornar todos los productos en el formato esperado por el frontend
    return {
      code: 0,
      message: "success",
      items: allItems,
      total_items: allItems.length
    };
  }
}
