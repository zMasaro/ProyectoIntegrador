/**
 * Componente ProductList - Visualización y filtrado de productos Epson
 * 
 * Responsabilidades:
 * - Mostrar grid de productos en tarjetas
 * - Manejar imágenes con fallback
 * - Formatear precios en colones costarricenses
 * - Mostrar información completa de cada producto
 * 
 * Props:
 * - productos: Array de productos a mostrar
 * - busqueda: Término de búsqueda actual
 * - loading: Estado de carga
 */

import React from 'react';
import './ProductList.css';

/**
 * Componente para mostrar lista de productos Epson
 * Recibe productos filtrados desde el componente padre (App)
 */
function ProductList({ productos, busqueda, loading }) {
  
  /**
   * Maneja errores de carga de imágenes
   * Oculta la imagen y muestra placeholder
   */
  const manejarErrorImagen = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  /**
   * Formatea el precio en colones costarricenses
   * @param {string|number} precio - Precio a formatear
   * @returns {string} Precio formateado
   */
  const formatearPrecio = (precio) => {
    if (!precio) return 'Precio no disponible';
    
    try {
      const numero = parseFloat(precio);
      if (isNaN(numero)) return 'Precio no disponible';
      
      return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0
      }).format(numero);
    } catch (error) {
      return `₡${precio}`;
    }
  };

  /**
   * Construye la URL de imagen usando el proxy del backend
   * @param {object} producto - Objeto producto
   * @returns {string|null} URL de imagen o null
   */
  const construirUrlImagen = (producto) => {
    if (!producto.item_id) return null;
    return `http://localhost:3001/api/zoho/imagen/${producto.item_id}`;
  };

  // Si no hay productos, mostrar mensaje
  if (!loading && productos.length === 0) {
    return (
      <div className="products-container">
        <div className="empty-state">
          <h3>No se encontraron productos</h3>
          <p>
            {busqueda 
              ? `No hay productos que coincidan con "${busqueda}"`
              : 'No hay productos disponibles en este momento'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header con información de productos */}
      <div className="products-header">
        <h2>
          Productos {busqueda ? 'filtrados' : 'encontrados'}: {productos.length}
        </h2>
        {busqueda && (
          <p className="filter-info">
            Mostrando resultados para: <strong>"{busqueda}"</strong>
          </p>
        )}
      </div>
      
      {/* Grid de productos */}
      <div className="products-grid">
        {productos.map((producto) => (
          <div key={producto.item_id} className="product-card">
            
            {/* Sección de imagen */}
            <div className="product-image">
              {construirUrlImagen(producto) ? (
                <img 
                  src={construirUrlImagen(producto)}
                  alt={producto.name || 'Producto Epson'}
                  onError={manejarErrorImagen}
                  loading="lazy"
                />
              ) : null}
              <div className="image-placeholder" style={{ display: 'none' }}>
                <span>Sin imagen</span>
              </div>
            </div>
            
            {/* Header del producto */}
            <div className="product-header">
              <h3 className="product-name" title={producto.name}>
                {producto.name || 'Producto sin nombre'}
              </h3>
              
              {producto.sku && (
                <span className="product-sku">SKU: {producto.sku}</span>
              )}
              
              {producto.product_category && (
                <span className="product-category">
                  {producto.product_category}
                </span>
              )}
            </div>
            
            {/* Detalles del producto */}
            <div className="product-details">
              {producto.description && (
                <p className="product-description">
                  <strong>Descripción:</strong> {producto.description}
                </p>
              )}
              
              {/* Información comercial */}
              <div className="product-info">
                {producto.rate && (
                  <span className="product-price">
                    {formatearPrecio(producto.rate)}
                  </span>
                )}
                
                {producto.stock_on_hand !== undefined && (
                  <span className={`product-stock ${producto.stock_on_hand > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    Stock: {producto.stock_on_hand}
                  </span>
                )}
                
                {producto.status && (
                  <span className={`product-status status-${producto.status.toLowerCase()}`}>
                    {producto.status}
                  </span>
                )}
              </div>
              
              {/* Información adicional */}
              {(producto.brand || producto.manufacturer) && (
                <div className="product-meta">
                  {producto.brand && (
                    <span className="product-brand">Marca: {producto.brand}</span>
                  )}
                  {producto.manufacturer && (
                    <span className="product-manufacturer">
                      Fabricante: {producto.manufacturer}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
