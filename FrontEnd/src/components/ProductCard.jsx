import { Link } from "react-router-dom";
import '../styles/Card.css';

function ProductCard({ producto }) {
  //const { itemId, sku, name, description, price } = producto;

  //Control de errores de imagen
  const manejarErrorImagen = (image) => {
    image.target.style.display = 'none';
    const placeholder = image.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  //Le da el Formato al precio
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

  //Construye la URL de imagen usando el proxy del backend
  // Muy ineficiente porque hace tardar la pagina en cargar demasiado, pero no hay otra forma de hacerlo
  const construirUrlImagen = (producto) => {
    if (!producto.itemId) return null;
    return `http://localhost:3001/api/zoho/imagen/${producto.itemId}`;
  };




  return (

    <article className="product-card">

      <div key={producto.itemId} >

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


          <Link
            to="/producto"
            state={{ producto }}
          >
            {producto.name || 'Producto sin nombre'}
          </Link>

          {producto.itemId && (
            <span className="product-sku">Item id: {producto.itemId} <br /></span>
          )}

          {producto.sku && (
            <span className="product-sku">SKU: {producto.sku}</span>
          )}

          {producto.productCategory && (
            <span className="product-category">
              {producto.productCategory}
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
            {producto.price && (
              <span className="product-price">
                {formatearPrecio(producto.price)} <br />
              </span>
            )}

            {producto.stock_on_hand !== undefined && (
              <span className={`product-stock ${producto.stock_on_hand > 0 ? 'in-stock' : 'out-of-stock'}`}>
                Stock: {producto.stock_on_hand} <br />
              </span>
            )}

            {producto.status && (
              <span className={`product-status status-${producto.status.toLowerCase()}`}>
                Estado: {producto.status} <br />
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
    </article>
  );
}

export default ProductCard;