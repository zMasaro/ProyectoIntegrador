
{/*
import React from 'react';
import './ProductList.css';


function ProductList({ productos, busqueda, loading }) {
  
 
  const manejarErrorImagen = (image) => {
    image.target.style.display = 'none';
    const placeholder = image.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };




  const formatearPrecio = (precio) => {
    if (!precio) return 'Precio no disponible';
      const numero = parseFloat(precio);      
      if (isNaN(numero)) return 'Precio no disponible';
      const formatter = new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0
      })      
      return formatter.format(numero);
    };


  const construirUrlImagen = (producto) => {
    if (!producto.item_id) return null;
    return `http://localhost:3001/api/zoho/imagen/${producto.item_id}`;
  };



  return (
    <div className="products-container">

      
      
 
      <div className="products-grid">
        {productos.map((producto) => (
          <div key={producto.item_id} className="product-card">
            
         
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
            
      
            <div className="product-details">
              {producto.description && (
                <p className="product-description">
                  <strong>Descripción:</strong> {producto.description}
                </p>
              )}
              
           
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

export default ProductList; */}
