import '../styles/ProductModal.css';

function ProductModal({ producto, onClose }) {
  //Control de errores de imagen
  const manejarErrorImagen = (image) => {
    image.target.style.display = 'none';
    const placeholder = image.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  const construirUrlImagen = (producto) => {
    if (!producto.itemId) return null;
    return `http://localhost:3001/api/zoho/imagen/${producto.itemId}`;
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="producto-contenedor">
          <div className="producto-imagen">
            {construirUrlImagen(producto) ? (
              <img
                src={construirUrlImagen(producto)}
                alt={producto.name || 'Producto'}
                onError={manejarErrorImagen}
                loading="lazy"
                className="imagen-producto"
              />
            ) : null}
            <div className="imagen-placeholder" style={{ display: 'none' }}>
              <span>Sin imagen</span>
            </div>
          </div>

          <h1 className="producto-nombre">{producto.name}</h1>
          <p className="producto-precio">Precio: {formatearPrecio(producto.price * 1.13)}</p>
          <p className="producto-descripcion">Descripcion: {producto.description}</p>
          <p className="producto-id">Item id: {producto.itemId}</p>
          <p className="producto-sku">Item SKU: {producto.sku}</p>
          <p className="producto-categoria">Categoria: {producto.productCategory}</p>
          <p className="producto-stock">Stock: {producto.stock_on_hand}</p>
          <p className="producto-status">Status: {producto.status}</p>
          <p className="producto-marca">{producto.brand}</p>
          <p className="producto-fabricante">{producto.manufacturer}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;