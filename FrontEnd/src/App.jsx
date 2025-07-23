/**
 * Componente principal de la aplicación de inventario Epson
 * Muestra una interfaz simple para visualizar productos Epson obtenidos desde Zoho Inventory
 * 
 * Responsabilidades:
 * - Gestionar el estado global de la aplicación
 * - Cargar datos desde el backend proxy
 * - Manejar la búsqueda y filtrado
 * - Orquestar componentes hijos
 */

import React, { useEffect, useState } from 'react';
import { obtenerProductosPorBusqueda } from './services/zoho.js';
import ProductList from './components/ProductList.jsx';
import './App.css';

/**
 * Componente App - Controlador principal de la aplicación
 * 
 * Estados:
 * - productos: Array completo de productos Epson obtenidos desde backend proxy
 * - productosFiltrados: Array de productos filtrados por búsqueda del usuario
 * - loading: Booleano que indica si los datos están cargando desde Zoho API
 * - error: String con mensaje de error si ocurre algún problema
 * - estadisticas: Métricas de procesamiento del backend (términos, tiempo, etc.)
 * - busqueda: Término de búsqueda actual del usuario
 * 
 * Funcionalidades:
 * - Carga automática de productos al montar componente
 * - Búsqueda en tiempo real sin llamadas adicionales al backend
 * - Manejo de estados de carga, error y datos
 * - Actualización manual del inventario
 */
function App() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  /**
   * Carga todos los productos Epson desde el backend proxy
   * El backend se encarga de hacer las llamadas a Zoho API con autenticación
   */
  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Llamada al backend proxy que consume Zoho Inventory API
      const data = await obtenerProductosPorBusqueda();
      setProductos(data.items || []);
      setProductosFiltrados(data.items || []);
      setEstadisticas(data.processing_stats || null);
    } catch (error) {
      console.error('Error al cargar productos desde backend proxy:', error);
      setError('Error al cargar los productos Epson. Verifica que el servidor backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtra los productos en memoria basado en el término de búsqueda
   * No requiere llamadas adicionales al backend - todo se hace en frontend
   * 
   * Busca en: nombre, descripción, SKU y categoría del producto
   */
  const filtrarProductos = (termino) => {
    if (!termino.trim()) {
      setProductosFiltrados(productos);
      return;
    }
    
    const terminoLower = termino.toLowerCase();
    const filtrados = productos.filter(producto => {
      const nombre = (producto.name || '').toLowerCase();
      const descripcion = (producto.description || '').toLowerCase();
      const sku = (producto.sku || '').toLowerCase();
      const categoria = (producto.product_category || '').toLowerCase();
      
      return nombre.includes(terminoLower) || 
             descripcion.includes(terminoLower) || 
             sku.includes(terminoLower) ||
             categoria.includes(terminoLower);
    });
    
    setProductosFiltrados(filtrados);
  };

  /**
   * Carga los productos automáticamente al montar el componente
   * Se ejecuta una sola vez al cargar la página
   */
  useEffect(() => {
    cargarProductos();
  }, []);

  /**
   * Reaplica filtros cuando cambian los productos base
   * Útil después de actualizar el inventario
   */
  useEffect(() => {
    if (busqueda) {
      filtrarProductos(busqueda);
    }
  }, [productos]);

  return (
    <div className="app-container">
      {/* Header con título y descripción */}
      <header className="app-header">
        <h1>Buscador Inteligente de Productos Epson</h1>
        <p>Descubre TODOS los productos Epson disponibles</p>
        
        {/* Campo de búsqueda */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos Epson (ej: L3110, EcoTank, tintas, cartuchos...)"
            value={busqueda}
            onChange={(e) => {
              const valor = e.target.value;
              setBusqueda(valor);
              filtrarProductos(valor);
            }}
            className="search-input"
          />
          <span className="search-icon">⌕</span>
        </div>

        {/* Botón de actualizar */}
        <button 
          className="refresh-button"
          onClick={cargarProductos}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Actualizar Inventario'}
        </button>
        
        {/* Estadísticas mejoradas */}
        {estadisticas && !loading && (
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Términos procesados:</span>
              <span className="stat-value">{estadisticas.terms_processed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total encontrados:</span>
              <span className="stat-value">{estadisticas.total_found}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Únicos:</span>
              <span className="stat-value">{estadisticas.unique_products}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tiempo:</span>
              <span className="stat-value">{estadisticas.processing_time_seconds}s</span>
            </div>
            {busqueda && (
              <div className="stat-item filtrados">
                <span className="stat-label">Filtrados:</span>
                <span className="stat-value">{productosFiltrados.length}</span>
              </div>
            )}
          </div>
        )}
      </header>
      
      {/* Contenido principal */}
      <main className="app-main">
        {loading ? (
          // Estado de carga mientras el backend consulta Zoho API
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Consultando inventario Epson desde Zoho...</p>
            <small>Procesando productos con 80+ términos de búsqueda</small>
          </div>
        ) : error ? (
          // Estado de error de conexión con backend/Zoho
          <div className="error-container">
            <h3>Error de Conexión</h3>
            <p>{error}</p>
            <button onClick={cargarProductos} className="retry-button">
              Reintentar Conexión
            </button>
          </div>
        ) : (
          // Componente especializado para mostrar productos
          <ProductList 
            productos={busqueda ? productosFiltrados : productos}
            busqueda={busqueda}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

export default App;
