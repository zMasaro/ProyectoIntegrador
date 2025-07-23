# Sistema Integrador Zoho - Catálogo Epson

Sistema de gestión de productos Epson que integra con la API de Zoho Inventory para mostrar un catálogo interactivo con búsqueda en tiempo real.

## Características

- **Backend**: Proxy TypeScript + Express que conecta con Zoho API
- **Frontend**: React + Vite con componentes especializados
- **Autenticación**: OAuth 2.0 automático con Zoho
- **Búsqueda**: 80+ términos de búsqueda para productos Epson
- **Interfaz**: Filtrado en tiempo real y visualización responsive

## Estructura del Proyecto

```
Integrador/
├── Backend/              # API TypeScript + Express
│   ├── src/
│   │   ├── app.ts           # Aplicación principal
│   │   ├── controllers/     # Controladores Zoho
│   │   ├── services/        # Lógica de negocio
│   │   ├── routes/          # Rutas API
│   │   └── config/          # Configuración DB y Zoho
│   ├── package.json
│   └── tsconfig.json
├── FrontEnd/             # React + Vite
│   ├── src/
│   │   ├── App.jsx          # Componente principal
│   │   ├── components/
│   │   │   └── ProductList.jsx  # Lista de productos
│   │   └── services/
│   │       └── zoho.js      # Cliente API
│   ├── package.json
│   └── vite.config.js
└── DEPLOYMENT_GUIDE.md   # Guía de instalación
```

## Instalación Rápida

### Backend
```bash
cd Backend
npm install
# Configurar .env con credenciales Zoho
npm run dev  # http://localhost:3001
```

### Frontend
```bash
cd FrontEnd
npm install
npm run dev  # http://localhost:5173
```

### Base de Datos
```sql
CREATE DATABASE ZohoInventory;
USE ZohoInventory;
CREATE TABLE zoho_tokens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    access_token NVARCHAR(MAX) NOT NULL,
    refresh_token NVARCHAR(MAX) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
```

## Configuración OAuth

1. Registrar aplicación en Zoho Developer Console
2. Configurar credenciales en `.env`
3. Autorizar en `http://localhost:3001/auth/zoho`
4. Los tokens se renuevan automáticamente

## Funcionalidades

### Backend
- Proxy seguro a API Zoho Inventory
- Búsqueda exhaustiva con 80+ términos Epson
- Renovación automática de tokens OAuth
- Proxy de imágenes autenticadas

### Frontend
- Componente `App.jsx`: Gestión de estado y datos
- Componente `ProductList.jsx`: Visualización de productos
- Búsqueda en tiempo real sin llamadas al servidor
- Interfaz responsive con grid adaptativo
- Formateo de precios en colones (₡)

## API Endpoints

- `GET /api/zoho/productos/busqueda` - Productos Epson
- `GET /api/zoho/imagen/:itemId` - Proxy de imágenes
- `GET /api/zoho/health` - Estado del servicio
- `GET /auth/zoho` - Autorización OAuth

## Tecnologías

- **Backend**: Node.js, TypeScript, Express, SQL Server
- **Frontend**: React 18, Vite, CSS3
- **API**: Zoho Inventory API
- **Auth**: OAuth 2.0

## Documentación

- `API_DOCUMENTATION.md` - Endpoints y servicios backend
- `FRONTEND_DOCUMENTATION.md` - Componentes y arquitectura
- `DEPLOYMENT_GUIDE.md` - Guía de instalación completa

---

**Versión**: 1.0.0 | **Última actualización**: Julio 2025
