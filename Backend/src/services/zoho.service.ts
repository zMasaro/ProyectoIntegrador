import axios from "axios";
import { getCurrentToken, ZOHO_ORG_ID, ZOHO_INVENTORY_URL, refreshAccessToken } from "../config/zoho.config";

/**
 * Servicio para interactuar con la API de Zoho Inventory
 * Permite obtener productos específicos de Epson desde el inventario
 * Incluye manejo automático de renovación de tokens y scraping inteligente
 */
export class ZohoService {
  private readonly baseURL = `${ZOHO_INVENTORY_URL}/inventory/v1`;

  // Términos de búsqueda EXHAUSTIVOS para TODO lo relacionado con impresoras Epson
  private readonly epsonSearchTerms = [
    // Marca principal
    'epson', 'EPSON', 'Epson',
    
    // Equipos principales
    'proyector', 'PROYECTOR', 'Proyector',
    'impresora', 'IMPRESORA', 'Impresora',
    'multifuncional', 'MULTIFUNCIONAL', 'Multifuncional',
    'scanner', 'SCANNER', 'Scanner',
    'plotter', 'PLOTTER', 'Plotter',
    
    // Consumibles líquidos
    'tinta', 'TINTA', 'Tinta', 'tintas',
    'ink', 'INK', 'Ink',
    
    // Cartuchos y contenedores
    'cartucho', 'CARTUCHO', 'Cartucho', 'cartuchos',
    'cartridge', 'CARTRIDGE', 'Cartridge',
    'contenedor', 'CONTENEDOR', 'Contenedor',
    'deposito', 'DEPOSITO', 'Deposito', 'depósito',
    'tanque', 'TANQUE', 'Tanque',
    
    // Tóners (aunque Epson usa más inkjet)
    'toner', 'TONER', 'Toner',
    
    // CABEZALES Y COMPONENTES CRÍTICOS
    'cabezal', 'CABEZAL', 'Cabezal', 'cabezales',
    'printhead', 'PRINTHEAD', 'Printhead',
    'head', 'HEAD', 'Head',
    'cabeza', 'CABEZA', 'Cabeza',
    
    // Componentes mecánicos
    'fusor', 'FUSOR', 'Fusor',
    'fuser', 'FUSER', 'Fuser',
    'tambor', 'TAMBOR', 'Tambor',
    'drum', 'DRUM', 'Drum',
    'rodillo', 'RODILLO', 'Rodillo', 'rodillos',
    'roller', 'ROLLER', 'Roller',
    'banda', 'BANDA', 'Banda',
    'belt', 'BELT', 'Belt',
    
    // Piezas y partes
    'pieza', 'PIEZA', 'Pieza', 'piezas',
    'parte', 'PARTE', 'Parte', 'partes',
    'component', 'COMPONENT', 'Component', 'componente',
    'repuesto', 'REPUESTO', 'Repuesto', 'repuestos',
    'spare', 'SPARE', 'Spare',
    
    // Mantenimiento
    'mantenimiento', 'MANTENIMIENTO', 'Mantenimiento',
    'maintenance', 'MAINTENANCE', 'Maintenance',
    'limpieza', 'LIMPIEZA', 'Limpieza',
    'cleaning', 'CLEANING', 'Cleaning',
    
    // Conectividad y accesorios
    'cable', 'CABLE', 'Cable', 'cables',
    'usb', 'USB', 'Usb',
    'wifi', 'WIFI', 'Wifi', 'wi-fi',
    'ethernet', 'ETHERNET', 'Ethernet',
    'adaptador', 'ADAPTADOR', 'Adaptador',
    'adapter', 'ADAPTER', 'Adapter',
    
    // Papel y medios
    'papel', 'PAPEL', 'Papel',
    'paper', 'PAPER', 'Paper',
    'media', 'MEDIA', 'Media',
    'fotográfico', 'FOTOGRÁFICO', 'Fotográfico',
    'photo', 'PHOTO', 'Photo',
    
    // Software y drivers
    'driver', 'DRIVER', 'Driver', 'drivers',
    'software', 'SOFTWARE', 'Software',
    'firmware', 'FIRMWARE', 'Firmware',
    
    // Códigos comunes
    'T664', 'T544', 'T774', 'T504', 'T005', 'T003', 'T001',
    '664', '544', '774', '504', '005', '003', '001',
    'C13T', 'c13t'
  ];

  // Palabras clave específicas de Epson AMPLIADAS para filtrado inteligente
  private readonly epsonKeywords = [
    // Modelos EcoTank populares
    'L3110', 'L3150', 'L3250', 'L3210', 'L3260',
    'L4150', 'L4160', 'L4260', 'L5190', 'L5290',
    'L6161', 'L6171', 'L6191', 'L6270', 'L6290',
    'L15150', 'L15160', 'L1800', 'L1300', 'L805',
    
    // Serie Expression
    'XP-241', 'XP-431', 'XP-441', 'XP-451', 'XP-461', 'XP-471',
    'XP-2100', 'XP-2150', 'XP-3100', 'XP-3150', 'XP-4100', 'XP-4150',
    'XP-5100', 'XP-5150', 'XP-6000', 'XP-6100', 'XP-15000',
    
    // Serie WorkForce
    'WF-2830', 'WF-2850', 'WF-2860', 'WF-2870',
    'WF-7710', 'WF-7720', 'WF-7740', 'WF-7840',
    'WF-C5790', 'WF-C5710', 'WF-C5210', 'WF-C8690',
    'WF-M5799', 'WF-M5299', 'WF-M20590',
    
    // Serie SureColor (plotters profesionales)
    'SC-P600', 'SC-P800', 'SC-P900', 'SC-P700',
    'SC-T3100', 'SC-T5100', 'SC-T7200', 'SC-T7700',
    'SC-F500', 'SC-F100', 'SC-F170', 'SC-F570',
    
    // Proyectores
    'EB-S41', 'EB-X41', 'EB-W42', 'EB-U42', 'EB-FH06',
    'EB-2040', 'EB-2140W', 'EB-2247U', 'EB-L200X',
    'EH-TW5650', 'EH-TW7100', 'EH-TW9400', 'EH-LS500',
    
    // Líneas de productos
    'EcoTank', 'ECOTANK', 'ecotank', 'Eco Tank',
    'Expression', 'EXPRESSION', 'expression',
    'WorkForce', 'WORKFORCE', 'workforce', 'Work Force',
    'SureColor', 'SURECOLOR', 'surecolor', 'Sure Color',
    'PowerLite', 'POWERLITE', 'powerlite', 'Power Lite',
    'Home Cinema', 'HOME CINEMA', 'home cinema',
    
    // Prefijos de proyectores
    'EB-', 'eb-', 'Eb-', 'EH-', 'eh-', 'Eh-',
    'EX-', 'ex-', 'Ex-', 'VS-', 'vs-', 'Vs-',
    'HC-', 'hc-', 'Hc-', 'TW-', 'tw-', 'Tw-',
    
    // Códigos de cartuchos principales
    '664', '544', '774', '504', '005', '003', '001',
    'T664', 'T544', 'T774', 'T504', 'T005', 'T003', 'T001',
    'T6641', 'T6642', 'T6643', 'T6644',
    'T5441', 'T5442', 'T5443', 'T5444',
    'T7741', 'T7742', 'T7743', 'T7744',
    
    // Códigos adicionales comunes
    'C13T', 'c13t', 'C13', 'c13',
    '252', '252XL', '254', '254XL',
    '288', '288XL', '312', '312XL',
    '410', '410XL', '502', '502XL',
    
    // Componentes específicos
    'printhead', 'cabezal', 'head',
    'waste ink', 'ink pad', 'maintenance box',
    'cutter', 'cortador', 'damper',
    'pump', 'bomba', 'sensor',
    
    // Series especiales
    'Photo', 'PHOTO', 'photo',
    'Pro', 'PRO', 'Professional',
    'Business', 'BUSINESS', 'business'
  ];

  /**
   * Verifica si un producto está relacionado con Epson usando análisis inteligente
   * @param item - Producto de Zoho Inventory
   * @returns boolean - true si está relacionado con Epson
   */
  private isEpsonRelated(item: any): boolean {
    if (!item) return false;

    // Campos a analizar del producto
    const fieldsToCheck = [
      item.name || '',
      item.description || '',
      item.brand || '',
      item.manufacturer || '',
      item.category_name || '',
      item.sku || '',
      item.item_name || '',
      ...(item.custom_fields || []).map((cf: any) => cf.value || '')
    ];

    const textToAnalyze = fieldsToCheck.join(' ').toLowerCase();

    // Verificar palabras clave específicas de Epson
    const hasEpsonKeywords = this.epsonKeywords.some(keyword => 
      textToAnalyze.includes(keyword.toLowerCase())
    );

    // Verificar términos generales de impresión
    const hasPrintingTerms = this.epsonSearchTerms.some(term => 
      textToAnalyze.includes(term.toLowerCase())
    );

    // Verificar patrones de modelo (números de serie típicos de Epson)
    const hasEpsonModelPattern = /\b(T\d{3}|L\d{4}|XP-\d{3}|WF-\d{4}|EB-\d{4}|EH-\d{4})\b/i.test(textToAnalyze);

    return hasEpsonKeywords || (hasPrintingTerms && hasEpsonModelPattern);
  }

  /**
   * Construye la URL de imagen de un producto usando los campos de Zoho
   * @param item - Producto de Zoho con información de imagen
   * @returns string - URL completa de la imagen o null
   */
  private buildImageUrl(item: any): string | null {
    try {
      // Verificar si tiene los campos necesarios para la imagen
      if (item.image_document_id && item.image_name) {
        // Construir URL usando el document_id de Zoho
        const imageUrl = `${ZOHO_INVENTORY_URL}/inventory/v1/items/${item.item_id}/image?organization_id=${ZOHO_ORG_ID}`;
        return imageUrl;
      }
      
      // URL alternativa si no tiene image_document_id pero tiene otros campos de imagen
      if (item.image_name || item.image_type) {
        return `${ZOHO_INVENTORY_URL}/inventory/v1/items/${item.item_id}/image?organization_id=${ZOHO_ORG_ID}`;
      }
      
      return null;
    } catch (error) {
      console.warn(`Error construyendo URL de imagen para item ${item.item_id}:`, error);
      return null;
    }
  }

  /**
   * Obtiene las imágenes de un producto específico (MEJORADO)
   * @param itemId - ID del producto en Zoho
   * @returns Promise con array de URLs de imágenes
   */
  private async getItemImages(itemId: string): Promise<string[]> {
    try {
      const response = await this.makeAuthenticatedRequest(`${this.baseURL}/items/${itemId}?organization_id=${ZOHO_ORG_ID}`);
      const item = response.data.item;
      
      const images: string[] = [];
      
      // Imagen principal usando los campos específicos
      const mainImageUrl = this.buildImageUrl(item);
      if (mainImageUrl) {
        images.push(mainImageUrl);
      }

      // Imágenes adicionales si existen en documentos
      if (item.documents && Array.isArray(item.documents)) {
        item.documents.forEach((doc: any) => {
          if (doc.file_type && doc.file_type.startsWith('image/')) {
            const docImageUrl = `${ZOHO_INVENTORY_URL}/inventory/v1/items/${itemId}/documents/${doc.document_id}/content?organization_id=${ZOHO_ORG_ID}`;
            images.push(docImageUrl);
          }
        });
      }

      return images;
    } catch (error) {
      console.warn(`No se pudieron obtener imágenes para el producto ${itemId}:`, error);
      return [];
    }
  }

  /**
   * Enriquece un producto con información adicional e imágenes (MEJORADO)
   * @param item - Producto base de Zoho
   * @returns Promise con producto enriquecido
   */
  private async enrichProduct(item: any): Promise<any> {
    try {
      // Construir URL de imagen principal
      const imageUrl = this.buildImageUrl(item);

      // Producto enriquecido con imagen y metadatos adicionales
      return {
        ...item,
        // URL de imagen principal
        image_url: imageUrl,
        // Metadatos de imagen originales
        image_metadata: {
          image_name: item.image_name || null,
          image_type: item.image_type || null,
          image_document_id: item.image_document_id || null
        },
        // Información adicional para filtrado
        search_text: [
          item.name || '',
          item.description || '',
          item.sku || '',
          item.brand || '',
          item.category_name || ''
        ].join(' ').toLowerCase(),
        // Indicador de producto con imagen
        has_image: !!imageUrl
      };
    } catch (error) {
      console.warn(`Error enriqueciendo producto ${item.item_id}:`, error);
      return {
        ...item,
        image_url: null,
        image_metadata: null,
        search_text: '',
        has_image: false
      };
    }
  }

  /**
   * Categoriza el tipo de producto basado en su información
   * @param item - Producto de Zoho
   * @returns string - Categoría del producto
   */
  private categorizeProduct(item: any): string {
    const text = `${item.name || ''} ${item.description || ''}`.toLowerCase();
    
    if (text.includes('tinta') || text.includes('cartucho') || text.includes('ink')) return 'TINTAS_CARTUCHOS';
    if (text.includes('proyector') || text.includes('projector')) return 'PROYECTORES';
    if (text.includes('impresora') || text.includes('printer')) return 'IMPRESORAS';
    if (text.includes('multifuncional') || text.includes('multifunction')) return 'MULTIFUNCIONALES';
    if (text.includes('scanner') || text.includes('escaner')) return 'SCANNERS';
    if (text.includes('cabezal') || text.includes('printhead')) return 'CABEZALES';
    if (text.includes('fusor') || text.includes('fuser')) return 'FUSORES';
    if (text.includes('tambor') || text.includes('drum')) return 'TAMBORES';
    if (text.includes('rodillo') || text.includes('roller')) return 'RODILLOS';
    if (text.includes('cable') || text.includes('adaptador')) return 'ACCESORIOS';
    
    return 'OTROS_COMPONENTES';
  }

  /**
   * Extrae la marca del producto
   */
  private extractBrand(item: any): string {
    const text = `${item.name || ''} ${item.brand || ''} ${item.description || ''}`.toLowerCase();
    if (text.includes('epson')) return 'EPSON';
    return item.brand || 'DESCONOCIDO';
  }

  /**
   * Extrae el modelo del producto usando expresiones regulares
   */
  private extractModel(item: any): string {
    const text = `${item.name || ''} ${item.sku || ''} ${item.description || ''}`;
    
    // Patrones comunes de modelos Epson
    const patterns = [
      /\b(L\d{4})\b/i,           // L3110, L4150, etc.
      /\b(XP-\d{3})\b/i,         // XP-241, XP-431, etc.
      /\b(WF-\d{4})\b/i,         // WF-2830, WF-7720, etc.
      /\b(EB-\d{4})\b/i,         // EB-2065, EB-2155, etc.
      /\b(EH-\d{4})\b/i,         // EH-TW650, etc.
      /\b(T\d{3})\b/i            // T664, T544, etc.
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].toUpperCase();
    }

    return 'MODELO_NO_IDENTIFICADO';
  }

  /**
   * Extrae el tipo de producto
   */
  private extractProductType(item: any): string {
    const text = `${item.name || ''} ${item.description || ''}`.toLowerCase();
    
    if (text.includes('tinta') || text.includes('ink')) return 'TINTA';
    if (text.includes('cartucho')) return 'CARTUCHO';
    if (text.includes('proyector')) return 'PROYECTOR';
    if (text.includes('impresora')) return 'IMPRESORA';
    if (text.includes('multifuncional')) return 'MULTIFUNCIONAL';
    if (text.includes('scanner')) return 'SCANNER';
    if (text.includes('cabezal')) return 'CABEZAL';
    if (text.includes('cable')) return 'CABLE';
    if (text.includes('adaptador')) return 'ADAPTADOR';
    
    return 'COMPONENTE';
  }

  /**
   * Extrae información de compatibilidad
   */
  private extractCompatibility(item: any): string[] {
    const text = `${item.name || ''} ${item.description || ''}`;
    const compatibility: string[] = [];
    
    // Buscar modelos compatibles mencionados
    const modelPattern = /\b(L\d{4}|XP-\d{3}|WF-\d{4}|EB-\d{4}|EH-\d{4})\b/gi;
    const matches = text.match(modelPattern);
    
    if (matches) {
      compatibility.push(...matches.map(m => m.toUpperCase()));
    }

    return [...new Set(compatibility)]; // Eliminar duplicados
  }

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
   * Obtiene TODOS los productos del inventario y filtra los relacionados con Epson
   * Utiliza scraping inteligente para encontrar productos que no estén etiquetados como "epson"
   * @returns Promise con todos los productos relacionados con Epson encontrados
   */
  async getAllEpsonItems() {
    console.log('Iniciando scraping inteligente de productos Epson...');
    
    let allEpsonItems: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    let totalProcessed = 0;
    let totalFound = 0;

    try {
      // Iterar a través de TODAS las páginas del inventario
      while (hasMore) {
        console.log(`Procesando página ${currentPage}...`);
        
        // Obtener todos los productos sin filtro específico
        const searchParams = new URLSearchParams({
          'per_page': '200',  // Máximo permitido por página
          'page': currentPage.toString(),
          'include': 'images' // Incluir información de imágenes
        });
        
        const response = await this.makeAuthenticatedRequest(`${this.baseURL}/items?${searchParams.toString()}`);
        const data = response.data;
        
        if (data.items && data.items.length > 0) {
          totalProcessed += data.items.length;
          
          // Filtrar productos relacionados con Epson usando análisis inteligente
          const epsonRelatedItems = data.items.filter((item: any) => this.isEpsonRelated(item));
          
          if (epsonRelatedItems.length > 0) {
            console.log(`Encontrados ${epsonRelatedItems.length} productos Epson en página ${currentPage}`);
            
            // Enriquecer productos con imágenes e información adicional
            const enrichedItems = await Promise.all(
              epsonRelatedItems.map((item: any) => this.enrichProduct(item))
            );
            
            allEpsonItems = allEpsonItems.concat(enrichedItems);
            totalFound += epsonRelatedItems.length;
          }
          
          // Verificar si hay más páginas disponibles
          if (data.page_context && data.page_context.has_more_page) {
            currentPage++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
        
        // Mostrar progreso cada 10 páginas
        if (currentPage % 10 === 0) {
          console.log(`Progreso: ${totalProcessed} productos procesados, ${totalFound} productos Epson encontrados`);
        }
      }
      
      console.log(`Scraping completado: ${totalFound} productos Epson encontrados de ${totalProcessed} productos totales`);
      
      // Categorizar y organizar los resultados
      const categorizedResults = this.categorizeResults(allEpsonItems);
      
      return {
        code: 0,
        message: "success",
        items: allEpsonItems,
        total_items: allEpsonItems.length,
        processing_stats: {
          total_processed: totalProcessed,
          total_found: totalFound,
          pages_processed: currentPage - 1
        },
        categories: categorizedResults
      };
      
    } catch (error) {
      console.error('Error durante el scraping inteligente:', error);
      throw error;
    }
  }

  /**
   * Obtiene productos usando múltiples términos de búsqueda y combina resultados
   * Método alternativo más rápido que busca específicamente por términos
   * @returns Promise con productos relacionados con Epson
   */
  async getEpsonItemsBySearch() {
    console.log('Iniciando búsqueda EXHAUSTIVA de ABSOLUTAMENTE TODO lo relacionado a EPSON...');
    
    const allResults = new Map<string, any>(); // Usar Map para evitar duplicados
    let totalSearches = 0;
    
    // TÉRMINOS EXHAUSTIVOS: Todo lo que puede estar relacionado con Epson
    const exhaustiveTerms = [
      // Marca principal
      'epson', 'EPSON', 'Epson',
      
      // Modelos de impresoras populares
      'L3110', 'L3150', 'L4150', 'L4160', 'L5190', 'L6160', 'L6170', 'L6190',
      'XP-241', 'XP-431', 'XP-441', 'XP-243', 'XP-245', 'XP-247', 'XP-440', 'XP-442',
      'WF-2830', 'WF-2850', 'WF-3720', 'WF-7720', 'WF-7210', 'WF-C5790',
      'ET-2720', 'ET-2750', 'ET-3750', 'ET-4750', 'ET-M1140', 'ET-M2140',
      
      // Proyectores
      'EB-2065', 'EB-2155W', 'EB-2265U', 'EB-X05', 'EB-S05', 'EB-W05',
      'PowerLite', 'BrightLink', 'Pro Cinema',
      
      // Series de productos
      'EcoTank', 'WorkForce', 'Expression', 'SureColor', 'PhotoMate',
      
      // Tintas y cartuchos
      'T664', 'T544', 'T774', 'T504', 'T673', 'T724', 'T664120', 'T664220',
      'T664320', 'T664420', '104', '003', '005', '108', '202', '212',
      
      // Componentes específicos
      'cabezal epson', 'fusor epson', 'tambor epson', 'rodillo epson',
      'tinta epson', 'cartucho epson', 'ribbon epson', 'cinta epson',
      
      // Palabras relacionadas
      'proyector', 'impresora', 'multifuncional', 'scanner', 'escaner',
      'tinta', 'cartucho', 'cabezal', 'fusor', 'tambor', 'rodillo',
      'alimentador', 'bandeja', 'papel', 'maintenance',
      
      // Códigos y referencias
      '1767062', '1724143', '1724144', 'C13T', 'C11C', 'B12B',
      
      // Accesorios
      'cable epson', 'adaptador epson', 'soporte epson', 'bolsa epson',
      'papel epson', 'limpieza epson', 'mantenimiento epson'
    ];
    
    try {
      // Buscar con TODOS los términos exhaustivos
      for (const searchTerm of exhaustiveTerms) {
        console.log(`Buscando EXHAUSTIVAMENTE: "${searchTerm}"`);
        
        let currentPage = 1;
        let hasMore = true;
        
        // EXHAUSTIVO: Buscar hasta 5 páginas por término para ser muy completo
        while (hasMore && currentPage <= 5) {
          const searchParams = new URLSearchParams({
            'search_text': searchTerm,
            'per_page': '200',
            'page': currentPage.toString(),
            'include': 'images'
          });
          
          const response = await this.makeAuthenticatedRequest(`${this.baseURL}/items?${searchParams.toString()}`);
          const data = response.data;
          
          if (data.items && data.items.length > 0) {
            // Procesar cada producto encontrado
            for (const item of data.items) {
              if (this.isEpsonRelated(item) && !allResults.has(item.item_id)) {
                const enrichedItem = await this.enrichProduct(item);
                allResults.set(item.item_id, enrichedItem);
              }
            }
            
            // Verificar si hay más páginas para este término
            if (data.page_context && data.page_context.has_more_page && currentPage < 5) {
              currentPage++;
            } else {
              hasMore = false;
            }
          } else {
            hasMore = false;
          }
        }
        
        totalSearches++;
        console.log(`Término "${searchTerm}" completado. Total productos únicos: ${allResults.size}`);
      }
      
      const finalResults = Array.from(allResults.values());
      const categorizedResults = this.categorizeResults(finalResults);
      
      console.log(`Búsqueda EXHAUSTIVA completada: ${finalResults.length} productos únicos encontrados`);
      
      return {
        code: 0,
        message: "success",
        items: finalResults,
        total_items: finalResults.length,
        processing_stats: {
          search_terms_used: totalSearches,
          unique_products_found: finalResults.length,
          search_method: "EXHAUSTIVE_SEARCH_ALL_EPSON_RELATED"
        },
        categories: categorizedResults
      };
      
    } catch (error) {
      console.error('Error durante la búsqueda por términos:', error);
      throw error;
    }
  }

  /**
   * Categoriza los resultados por tipo de producto
   * @param items - Array de productos
   * @returns Object con productos categorizados
   */
  private categorizeResults(items: any[]): any {
    const categories: { [key: string]: any[] } = {
      TINTAS_CARTUCHOS: [],
      PROYECTORES: [],
      IMPRESORAS: [],
      MULTIFUNCIONALES: [],
      SCANNERS: [],
      CABEZALES: [],
      FUSORES: [],
      TAMBORES: [],
      RODILLOS: [],
      ACCESORIOS: [],
      OTROS_COMPONENTES: []
    };

    items.forEach(item => {
      const category = item.product_category || 'OTROS_COMPONENTES';
      if (categories[category]) {
        categories[category].push(item);
      } else {
        categories.OTROS_COMPONENTES.push(item);
      }
    });

    // Agregar estadísticas por categoría
    const categoryStats = Object.keys(categories).map(cat => ({
      category: cat,
      count: categories[cat].length
    }));

    return {
      ...categories,
      stats: categoryStats
    };
  }

  /**
   * Método legacy - mantener compatibilidad con código existente
   * @returns Promise con datos de la primera página de productos Epson
   */
  async getItems() {
    console.log('Usando método legacy - se recomienda usar getAllEpsonItems() para resultados completos');
    
    const searchParams = new URLSearchParams({
      'search_text': 'epson',
      'per_page': '200',
      'page': '1',
      'include': 'images'
    });
    
    const response = await this.makeAuthenticatedRequest(`${this.baseURL}/items?${searchParams.toString()}`);
    return response.data;
  }

  /**
   * Obtiene la imagen de un producto específico
   * @param itemId - ID del producto en Zoho
   * @returns Promise con datos de imagen o null
   */
  async getProductImage(itemId: string): Promise<{ data: Buffer; contentType: string } | null> {
    try {
      // Construir URL de imagen con autenticación
      const imageUrl = `${ZOHO_INVENTORY_URL}/inventory/v1/items/${itemId}/image?organization_id=${ZOHO_ORG_ID}`;
      
      // Hacer petición autenticada para obtener la imagen
      const response = await this.makeAuthenticatedRequest(imageUrl, {
        responseType: 'arraybuffer'
      });
      
      // Determinar content type desde headers o por defecto
      const contentType = response.headers['content-type'] || 'image/jpeg';
      
      return {
        data: Buffer.from(response.data),
        contentType: contentType
      };
      
    } catch (error) {
      console.warn(`No se pudo obtener imagen para producto ${itemId}:`, error);
      return null;
    }
  }
}
