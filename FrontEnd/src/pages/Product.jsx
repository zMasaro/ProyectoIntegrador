import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <div>
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
      <h1>{producto.name}</h1>
      <p>Precio: {producto.price}</p>
      <p>{producto.description}</p>
      <button onClick={() => navigate("/")}>Volver</button>
    </div>
  );
}

export default Product;
