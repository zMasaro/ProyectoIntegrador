import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Product.css'; // Asegúrate de que la ruta sea correcta

function Product() {
  const location = useLocation();
  const navigate = useNavigate();

  const { producto } = location.state || {};
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

  if (!producto) {
    return (
      <div>
        <p>No se recibió ningún producto.</p>
        <button onClick={() => navigate("/")}>Volver</button>
      </div>
    );
  }

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
      <p className="producto-id">Item id: {producto.item_id}</p>
      <p className="producto-sku">Item SKU: {producto.sku}</p>
      <p className="producto-categoria">Categoria: {producto.product_category}</p>
      <p className="producto-stock">Stock: {producto.stock_on_hand}</p>
      <p className="producto-status">Status: {producto.status}</p>
      <p className="producto-marca">{producto.brand}</p>
      <p className="producto-fabricante">{producto.manufacturer}</p>

      <button className="boton-volver" onClick={() => navigate("/")}>
        Volver
      </button>
    </div>

  );
}

export default Product;
