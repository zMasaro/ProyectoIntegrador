import { useEffect, useState, useCallback } from 'react';
import { obtenerProductosPorBusqueda } from '../services/zoho.ts';
import ProductCard from '../components/ProductCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import '../styles/Main.css';

function Main() {



    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        } catch (error) {
            console.error('Error al cargar productos desde backend proxy:', error);
            setError('Error al cargar los productos Epson. Verifica que el servidor backend esté funcionando.');
        } finally {
            setLoading(false);
        }
    };

    const [filtrosCheckbox, setFiltrosCheckbox] = useState({});
    
    const filtrarProductos = useCallback((filtros) => {
        if (typeof filtros === 'object') {
        setFiltrosCheckbox(filtros);
        }
        let resultadosFiltrados = productos;
       if (busqueda) {
        const terminoLower = busqueda.toLowerCase();
        resultadosFiltrados = resultadosFiltrados.filter(producto => {
            const nombre = (producto.name || '').toLowerCase();
            const descripcion = (producto.description || '').toLowerCase();
            const sku = (producto.sku || '').toLowerCase();
            const categoria = (producto.product_category || '').toLowerCase();

            return nombre.includes(terminoLower) ||
                descripcion.includes(terminoLower) ||
                sku.includes(terminoLower) ||
                categoria.includes(terminoLower);
        });
    }

        if (Object.keys(filtrosCheckbox).length > 0){
         resultadosFiltrados = resultadosFiltrados.filter(producto => {
            const nombre = (producto.name || '').toLowerCase();
            const descripcion = (producto.description || '').toLowerCase();

            const cumpleFiltro = (claveFiltro) => {
                const filtro = filtros[claveFiltro];
                return (
                    !filtro?.length ||
                    filtro.some(valor =>
                        nombre.toLowerCase().includes(valor.toLowerCase()) ||
                        descripcion.toLowerCase().includes(valor.toLowerCase())
                    )
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
        filtrarProductos(filtrosCheckbox);
    }, [productos, busqueda, filtrosCheckbox, filtrarProductos]);


    // Si no hay productos, mostrar mensaje
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
        <section class="main-container">
            <header className="headerMain">
                <div className="nav-content">
                    <input
                        type="text"
                        placeholder="Buscar productos Epson (ej: L3110, EcoTank, tintas, cartuchos...)"
                        value={busqueda}
                        onChange={(texto) => {
                            const valor = texto.target.value;
                            setBusqueda(valor);
                            filtrarProductos(valor);
                        }}
                        className="search-input"
                    />

                    {busqueda && (
                        <p className="filter-info">
                            {productosFiltrados.length} productos encontrados <strong>"{busqueda}"</strong>
                        </p>
                    )}
                </div>
            </header>

            <section class="hero">
                <Sidebar class="Sidebar" />

                <main className="main">
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

                        <section className="product-list">{
                            productosFiltrados.map((producto) => (
                                <ProductCard
                                    key={producto.item_id}
                                    itemId={producto.item_id}
                                    sku={producto.sku}
                                    name={producto.name}
                                    description={producto.description}
                                    price={producto.rate}

                                    productCategory={producto.product_category}
                                    stock_on_hand={producto.stock_on_hand}
                                    status={producto.status}
                                    brand={producto.brand}
                                    manufacturer={producto.manufacturer}
                                />
                            ))
                        }
                        </section>
                    )}

                </main>
            </section>

        </section>
    );
}

export default Main;