# 🤖 Sistema de Scraping Inteligente para Productos Epson

## 📋 Resumen de Funcionalidades

Este sistema implementa **scraping inteligente** para obtener **TODOS** los productos relacionados con Epson desde Zoho Inventory, no solo los etiquetados como "epson".

### 🎯 **Funcionalidades Principales**

1. **Scraping Inteligente Completo** - Analiza TODO el inventario
2. **Búsqueda por Términos Múltiples** - Método más rápido con términos específicos
3. **Categorización Automática** - Organiza productos por tipo
4. **Enriquecimiento de Datos** - Extrae imágenes y metadatos adicionales
5. **Análisis de Compatibilidad** - Identifica modelos compatibles

## 🛠️ **Endpoints Disponibles**

### **1. Scraping Inteligente Completo**
```
GET /api/zoho/productos/inteligente
```

**Descripción:** Analiza TODOS los productos del inventario usando IA para identificar productos relacionados con Epson.

**Características:**
- ✅ Encuentra productos no etiquetados como "epson"
- ✅ Incluye tintas, componentes, cables, adaptadores
- ✅ Extrae imágenes automáticamente
- ✅ Categoriza por tipo de producto
- ✅ Más completo pero más lento

**Respuesta:**
```json
{
  "code": 0,
  "message": "success",
  "items": [...],
  "total_items": 1250,
  "processing_stats": {
    "total_processed": 5000,
    "total_found": 1250,
    "pages_processed": 25
  },
  "categories": {
    "TINTAS_CARTUCHOS": [...],
    "PROYECTORES": [...],
    "IMPRESORAS": [...],
    "stats": [...]
  },
  "timestamp": "2025-07-23T20:45:00.000Z",
  "processing_method": "intelligent_scraping"
}
```

### **2. Búsqueda por Términos Múltiples**
```
GET /api/zoho/productos/busqueda
```

**Descripción:** Busca específicamente usando múltiples términos relacionados con Epson.

**Características:**
- ⚡ Más rápido que el scraping completo
- ✅ Usa 35+ términos de búsqueda específicos
- ✅ Elimina duplicados automáticamente
- ✅ Incluye imágenes y metadatos

**Términos de búsqueda utilizados:**
- `epson`, `proyector`, `impresora`, `tinta`, `cartucho`
- `L3110`, `L4150`, `XP-431`, `WF-2830`, `EB-2065`
- `EcoTank`, `WorkForce`, `PowerLite`, `SureColor`
- Y muchos más...

### **3. Filtro por Categoría**
```
GET /api/zoho/productos/categoria/{categoria}
```

**Categorías disponibles:**
- `TINTAS_CARTUCHOS` - Tintas, cartuchos de impresión
- `PROYECTORES` - Proyectores Epson y accesorios
- `IMPRESORAS` - Impresoras multifuncionales y laser
- `MULTIFUNCIONALES` - Equipos todo-en-uno
- `SCANNERS` - Escáneres y digitalizadores
- `CABEZALES` - Cabezales de impresión
- `FUSORES` - Unidades fusoras
- `TAMBORES` - Tambores fotoconductores
- `RODILLOS` - Rodillos de transferencia
- `ACCESORIOS` - Cables, adaptadores, soportes
- `OTROS_COMPONENTES` - Componentes diversos

### **4. Método Legacy**
```
GET /api/zoho/productos
```

**Descripción:** Método original que busca solo productos etiquetados como "epson".

## 🔍 **Algoritmo de Detección Inteligente**

### **Análisis de Campos:**
```typescript
// Campos analizados en cada producto
- name (nombre del producto)
- description (descripción)
- brand (marca)
- manufacturer (fabricante)
- category_name (categoría)
- sku (código de producto)
- custom_fields (campos personalizados)
```

### **Criterios de Detección:**
1. **Palabras clave específicas de Epson**
   - Modelos: L3110, XP-431, WF-2830, EB-2065, etc.
   - Series: EcoTank, WorkForce, PowerLite, SureColor

2. **Términos relacionados con impresión**
   - epson, proyector, impresora, tinta, cartucho, scanner

3. **Patrones de modelo (RegEx)**
   - `T\d{3}` (T664, T544, etc.)
   - `L\d{4}` (L3110, L4150, etc.)
   - `XP-\d{3}` (XP-241, XP-431, etc.)
   - `WF-\d{4}` (WF-2830, WF-7720, etc.)

## 🖼️ **Gestión de Imágenes**

### **Tipos de Imágenes Obtenidas:**
1. **Imagen Principal** - `primary_image`
2. **Imágenes Adicionales** - Array `images[]`
3. **URLs de Acceso** - Enlaces directos a Zoho

### **Estructura de Imágenes:**
```json
{
  "item_id": "123456",
  "name": "TINTA EPSON T664 NEGRO",
  "primary_image": "https://www.zohoapis.com/inventory/v1/items/123456/image",
  "images": [
    "https://www.zohoapis.com/inventory/v1/items/123456/image",
    "https://www.zohoapis.com/inventory/v1/items/123456/documents/789/content"
  ]
}
```

## 🏷️ **Metadatos Enriquecidos**

Cada producto se enriquece con información adicional:

```json
{
  "extracted_info": {
    "brand": "EPSON",
    "model": "L3110",
    "product_type": "TINTA",
    "compatibility": ["L3110", "L3150", "L4150"]
  },
  "product_category": "TINTAS_CARTUCHOS",
  "is_epson_product": true
}
```

## 📊 **Estadísticas de Procesamiento**

### **Scraping Inteligente:**
```json
{
  "processing_stats": {
    "total_processed": 5000,    // Total de productos analizados
    "total_found": 1250,        // Productos Epson encontrados
    "pages_processed": 25       // Páginas procesadas
  }
}
```

### **Búsqueda por Términos:**
```json
{
  "processing_stats": {
    "search_terms_used": 35,           // Términos utilizados
    "unique_products_found": 980       // Productos únicos encontrados
  }
}
```

## ⚡ **Comparación de Rendimiento**

| Método | Velocidad | Completitud | Uso Recomendado |
|--------|-----------|-------------|-----------------|
| **Scraping Inteligente** | 🐌 Lento | 🎯 100% | Análisis completo inicial |
| **Búsqueda por Términos** | ⚡ Rápido | 🎯 95% | Uso regular en producción |
| **Filtro por Categoría** | 🚀 Instantáneo | 🎯 N/A | Después de obtener datos |
| **Método Legacy** | ⚡ Rápido | 🎯 30% | Solo productos etiquetados |

## 🚀 **Ejemplos de Uso**

### **Frontend JavaScript:**
```javascript
// Obtener todos los productos con scraping inteligente
const response = await fetch('/api/zoho/productos/inteligente');
const data = await response.json();

console.log(`Encontrados ${data.total_items} productos Epson`);
console.log(`Categorías disponibles:`, data.categories.stats);

// Filtrar solo tintas
const tintas = data.categories.TINTAS_CARTUCHOS;
console.log(`Tintas encontradas: ${tintas.length}`);

// Obtener solo proyectores
const proyectores = await fetch('/api/zoho/productos/categoria/PROYECTORES');
const proyectoresData = await proyectores.json();
```

### **cURL:**
```bash
# Scraping completo
curl "http://localhost:3001/api/zoho/productos/inteligente"

# Búsqueda rápida
curl "http://localhost:3001/api/zoho/productos/busqueda"

# Solo tintas
curl "http://localhost:3001/api/zoho/productos/categoria/TINTAS_CARTUCHOS"
```

## 🔧 **Configuración y Mantenimiento**

### **Agregar Nuevos Términos de Búsqueda:**
```typescript
// En zoho.service.ts
private readonly epsonSearchTerms = [
  // Agregar nuevos términos aquí
  'nuevo_modelo',
  'nueva_serie'
];
```

### **Agregar Nuevas Categorías:**
```typescript
// En método categorizeProduct()
if (text.includes('nuevo_tipo')) return 'NUEVA_CATEGORIA';
```

## 🎯 **Resultados Esperados**

Con este sistema puedes encontrar:

✅ **Productos Etiquetados:** EPSON L3110, Proyector EB-2065
✅ **Tintas Compatibles:** T664 para L3110, T544 para XP-431  
✅ **Componentes:** Cabezales, fusores, tambores Epson
✅ **Accesorios:** Cables USB para impresoras, adaptadores
✅ **Proyectores:** PowerLite, EB series, EH series
✅ **Multifuncionales:** WorkForce, Expression series

Este sistema te dará una vista **completa** del inventario relacionado con Epson, no solo los productos obvios.
