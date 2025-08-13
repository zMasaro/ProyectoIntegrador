import { useEffect, useState, useCallback, useMemo } from 'react';
import { obtenerProductosPorBusqueda } from '../services/zoho.ts';
import ProductCard from '../components/ProductCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx'; 
import logo from '../img/InjaconLogo.png'; // Asegúrate de que la ruta sea correcta
import '../styles/Main.css';

function Main() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtrosCheckbox, setFiltrosCheckbox] = useState({});

  // 🔹 Paginado
  const [page, setPage] = useState(1);
  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(productosFiltrados.length / perPage));

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerProductosPorBusqueda();
      setProductos(data.items || []);
      setProductosFiltrados(data.items || []);
    } catch (error) {
      console.error('Error al cargar productos desde backend proxy:', error);
      setError('Error al cargar los productos Epson. Verifica que el servidor backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarProductos = useCallback((filtros) => {
    if (typeof filtros === 'object') setFiltrosCheckbox(filtros);

    let resultadosFiltrados = productos;

    if (busqueda) {
      const terminoLower = busqueda.toLowerCase();
      resultadosFiltrados = resultadosFiltrados.filter(producto => {
        const nombre = (producto.name || '').toLowerCase();
        const descripcion = (producto.description || '').toLowerCase();
        const sku = (producto.sku || '').toLowerCase();
        const categoria = (producto.product_category || '').toLowerCase();
        return (
          nombre.includes(terminoLower) ||
          descripcion.includes(terminoLower) ||
          sku.includes(terminoLower) ||
          categoria.includes(terminoLower)
        );
      });
    }

    if (Object.keys(filtrosCheckbox).length > 0) {
      resultadosFiltrados = resultadosFiltrados.filter(producto => {
        const nombre = (producto.name || '').toLowerCase();
        const descripcion = (producto.description || '').toLowerCase();

        const cumpleFiltro = (claveFiltro) => {
          const filtro = filtros[claveFiltro];
          return !filtro?.length || filtro.some(valor =>
            nombre.includes(valor.toLowerCase()) ||
            descripcion.includes(valor.toLowerCase())
          );
        };

        const cumpleModelo = cumpleFiltro('modelo');
        const cumpleFuncion = cumpleFiltro('funcion');
        const cumpleConectividad = cumpleFiltro('conectividad');
        const cumpleGenerales = cumpleFiltro('generales');

        return cumpleModelo && cumpleFuncion && cumpleConectividad && cumpleGenerales;
      });
    }

    setProductosFiltrados(resultadosFiltrados);
  }, [productos, busqueda, filtrosCheckbox]);

  // Carga inicial
  useEffect(() => { cargarProductos(); }, []);

  // Reaplica filtros al cambiar base/búsqueda/filtros + resetea a página 1
  useEffect(() => {
    filtrarProductos(filtrosCheckbox);
    setPage(1); // 🔸 reset paginado cuando cambian filtros/búsqueda
  }, [productos, busqueda, filtrosCheckbox, filtrarProductos]);

  // Asegura que la página no se pase del total
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // Items de la página actual
  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return productosFiltrados.slice(start, start + perPage);
  }, [productosFiltrados, page, perPage]);

  if (!loading && productos.length === 0) {
    return (
      <p>No se encontraron productos
        {busqueda
          ? `No hay productos que coincidan con "${busqueda}"`
          : 'No hay productos disponibles en este momento'
        }
      </p>
    );
  }

  return (
    <section className="main-container">{/* <- className */}
      <Navbar
      query={busqueda}
      results={productosFiltrados.length}
      onQueryChange={(valor) => setBusqueda(valor)}
      logoSrc={logo} 
     />

      <section className="hero-layout">
        <Sidebar className="Sidebar" categoriasFiltradas={filtrarProductos} />{/* <- className */}

        <main className="main">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Consultando inventario Epson desde Zoho...</p>
              <small>Procesando productos con 80+ términos de búsqueda</small>
            </div>
          ) : error ? (
            <div className="error-container">
              <h3>Error de Conexión</h3>
              <p>{error}</p>
              <button onClick={cargarProductos} className="retry-button">Reintentar Conexión</button>
            </div>
          ) : (
            <>
              {/* Lista paginada */}
              <section className="product-list">
                {pageItems.map((producto) => (
                  <ProductCard
                    key={producto.item_id}
                    producto={{
                      itemId: producto.item_id,
                      sku: producto.sku,
                      name: producto.name,
                      description: producto.description,
                      price: producto.rate,
                      productCategory: producto.product_category,
                      stock_on_hand: producto.stock_on_hand,
                      status: producto.status,
                      brand: producto.brand,
                      manufacturer: producto.manufacturer
                    }}
                  />
                ))}
              </section>

              {/* Controles de paginado */}
              <div className="pagination">
                <button onClick={() => setPage(1)} disabled={page === 1}>« Primero</button>
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Anterior</button>
                <span>Página {page} de {totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Siguiente →</button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>Último »</button>
              </div>
            </>
          )}
        </main>
      </section>
    </section>
  );
}

export default Main;
