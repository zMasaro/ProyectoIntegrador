import axios from "axios";
import { ZOHO_AUTH_TOKEN, ZOHO_ORG_ID } from "../config/zoho.config";

/**
 * Servicio para interactuar con la API de Zoho Inventory
 * Permite obtener productos específicos de Epson desde el inventario
 */
export class ZohoService {
  private readonly baseURL = "https://www.zohoapis.com/inventory/v1";

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
    
    const response = await axios.get(`${this.baseURL}/items?${searchParams.toString()}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${ZOHO_AUTH_TOKEN}`,
        "Content-Type": "application/json",
        "X-com-zoho-inventory-organizationid": ZOHO_ORG_ID,
      },
    });

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
      
      const response = await axios.get(`${this.baseURL}/items?${searchParams.toString()}`, {
        headers: {
          Authorization: `Zoho-oauthtoken ${ZOHO_AUTH_TOKEN}`,
          "Content-Type": "application/json",
          "X-com-zoho-inventory-organizationid": ZOHO_ORG_ID,
        },
      });

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
