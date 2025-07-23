# Frontend Documentation

## Descripción General

Aplicación React que consume el backend proxy para mostrar productos Epson desde Zoho Inventory.

### Tecnologías Utilizadas
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Lenguaje**: JavaScript (JSX)
- **HTTP Client**: Fetch API nativo

### Estructura de Componentes
```
FrontEnd/src/
├── App.jsx                    # Componente principal (estado y lógica)
├── components/ProductList.jsx # Componente de visualización de productos
├── services/zoho.js          # Cliente para consumir backend
└── assets/                   # Assets estáticos
```

## Componentes Implementados

### App.jsx - Controlador Principal
**Responsabilidades**:
- Gestión de estado global (productos, loading, error, búsqueda)
- Carga de datos desde backend proxy
- Filtrado en tiempo real sin llamadas adicionales al servidor
- Orquestación de componentes hijos

**Estados principales**:
```javascript
const [productos, setProductos] = useState([]);
const [productosFiltrados, setProductosFiltrados] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [busqueda, setBusqueda] = useState('');
```

### ProductList.jsx - Visualización de Productos
**Responsabilidades**:
- Mostrar grid responsivo de productos
- Manejo de imágenes con fallback
- Formateo de precios en colones costarricenses
- Estados de loading y error

## Funcionalidades Clave

### 1. Búsqueda en Tiempo Real
- Filtrado instantáneo sin llamadas al servidor
- Búsqueda en nombre, SKU, descripción y categoría
- Interfaz responsiva con resultados inmediatos

### 2. Visualización de Productos
- Grid adaptativo para diferentes pantallas
- Imágenes con lazy loading y fallbacks
- Formateo automático de precios en colones (₡)

### 3. Estados de la Aplicación
- Loading con spinner durante carga inicial
- Manejo elegante de errores de conexión
- Empty state cuando no hay resultados

## Servicios

### zoho.js - Cliente del Backend
```javascript
export const obtenerProductosPorBusqueda = async () => {
  const response = await fetch('http://localhost:3001/api/zoho/productos/busqueda');
  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }
  return response.json();
};
```

## Ejecución

### Desarrollo
```bash
cd FrontEnd
npm install
npm run dev  # http://localhost:5173
```

### Producción
```bash
npm run build
npm run preview
```

---

**Versión**: 1.0.0  
**Última actualización**: Julio 2025
