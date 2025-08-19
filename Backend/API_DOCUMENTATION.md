# Backend API Documentation

## Descripción General

**Middleware/Proxy REST** desarrollado en TypeScript con Express.js que consume la **API de Zoho Inventory** y agrega lógica específica para productos Epson.

**Importante**: Este backend actúa como proxy inteligente entre el frontend y Zoho API, no es una API nueva.

### Funcionalidades Implementadas
- Consume API oficial de Zoho Inventory con autenticación OAuth
- Búsqueda exhaustiva con 80+ términos específicos de Epson
- Proxy de imágenes autenticadas desde Zoho
- Filtrado y categorización automática de productos
- Renovación automática de tokens OAuth

## Arquitectura

### Tecnologías Utilizadas
- **Runtime**: Node.js 18+
- **Framework**: Express.js (como proxy/middleware)
- **Lenguaje**: TypeScript
- **API Consumida**: Zoho Inventory API v1
- **Autenticación**: OAuth 2.0 Zoho
- **HTTP Client**: Axios

### Estructura del Proyecto
```
Backend/src/
├── app.ts                 # Servidor principal
├── config/zoho.config.ts  # Configuración OAuth
├── controllers/zoho.controller.ts # Controladores HTTP
├── services/zoho.service.ts # Lógica de negocio
├── routes/zoho.routes.ts  # Definición de endpoints
└── utils/encryption.ts   # Utilidades
```

## Configuración

### Variables de Entorno Requeridas
```env
# Credenciales OAuth de Zoho
ZOHO_AUTH_TOKEN=1000.xxx...
ZOHO_REFRESH_TOKEN=1000.yyy...
ZOHO_CLIENT_ID=1000.ABC...
ZOHO_CLIENT_SECRET=abc123...
ZOHO_ORG_ID=751498119

# Configuración del servidor
PORT=3001
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_INVENTORY_URL=https://www.zohoapis.com
```

## Endpoints Implementados

### GET /api/zoho/productos/busqueda
**Función**: Búsqueda optimizada de productos Epson usando 80+ términos específicos.

**Respuesta**:
```json
{
  "code": 0,
  "message": "success",
  "items": [...],
  "total_items": 172,
  "processing_stats": {
    "terms_processed": 80,
    "total_found": 890,
    "unique_products": 172,
    "processing_time_seconds": 8.2
  }
}
```

### GET /api/zoho/imagen/:itemId
**Función**: Proxy para servir imágenes de productos desde Zoho con autenticación.

**Parámetros**: `itemId` - ID del producto en Zoho

**Headers de Respuesta**:
```
Content-Type: image/jpeg
Cache-Control: public, max-age=3600
```

### GET /api/zoho/productos/categoria/:categoria
**Función**: Filtra productos por categoría usando lógica propia.

**Categorías disponibles**: TINTAS_CARTUCHOS, PROYECTORES, IMPRESORAS, etc.

## Funcionalidades Clave

### 1. Búsqueda Exhaustiva
- 80+ términos específicos de Epson procesados en paralelo
- Filtrado inteligente para encontrar productos relacionados
- 172 productos únicos identificados de ~15,000 en inventario

### 2. Autenticación OAuth Automática
- Renovación automática de tokens cada 50 minutos
- Manejo transparente de credenciales de Zoho
- Sistema resiliente a expiración de tokens

### 3. Proxy de Imágenes
- Servir imágenes autenticadas desde Zoho API
- Cache headers para optimización
- Manejo de errores de imagen con fallbacks

## Ejecución

### Desarrollo
```bash
cd Backend
npm install
npm run dev  # Servidor en puerto 3001
```

### Producción
```bash
npm run build
npm start
```

---

**Versión**: 2.0.0  
**API Externa**: Zoho Inventory API v1  
**Última actualización**: Julio 2025
