import { useEffect, useState, useCallback } from 'react';
import { obtenerProductosPorBusqueda } from '../services/zoho.ts';
import ProductCard from '../components/ProductCard.jsx';
import Sidebar from '../components/Sidebar.jsx';

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


    const filtrarProductos = useCallback((filtros) => {
        // Si no hay filtros, mostrar todos los productos
        if (!filtros || (typeof filtros === 'string' && !filtros.trim())) {
            setProductosFiltrados(productos);
            return;
        }

        // Si es una cadena de texto, realizar búsqueda general
        if (typeof filtros === 'string') {
            const terminoLower = filtros.toLowerCase();
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
            return;
        }

        // Si es un objeto con selecciones múltiples
        const filtrados = productos.filter(producto => {
            // Convertir todos los valores a minúsculas para comparación
            const nombre = (producto.name || '').toLowerCase();
            const descripcion = (producto.description || '').toLowerCase();
            const categoria = (producto.product_category || '').toLowerCase();

            // Verificar cada tipo de filtro
            const cumpleModelo = !filtros.modelo?.length || 
                filtros.modelo.some(modelo => 
                    nombre.includes(modelo.toLowerCase()) || 
                    descripcion.includes(modelo.toLowerCase())
                );

            const cumpleFuncion = !filtros.funcion?.length || 
                filtros.funcion.some(funcion => 
                    descripcion.includes(funcion.toLowerCase())
                );

            const cumpleConectividad = !filtros.conectividad?.length || 
                filtros.conectividad.some(conn => 
                    descripcion.includes(conn.toLowerCase())
                );

            const cumpleGenerales = !filtros.generales?.length || 
                filtros.generales.some(gen => 
                    categoria.includes(gen.toLowerCase()) || 
                    descripcion.includes(gen.toLowerCase())
                );
            //Revisar el filtro que no trae algunos de los productos
            //return cumpleModelo && cumpleFuncion && cumpleConectividad && cumpleGenerales;
            // Si hay al menos un filtro seleccionado, el producto debe cumplir con al menos uno de ellos
            const hayFiltrosSeleccionados = 
                filtros.modelo?.length > 0 || 
                filtros.funcion?.length > 0 || 
                filtros.conectividad?.length > 0 || 
                filtros.generales?.length > 0;

            // Si no hay filtros seleccionados, mostrar el producto
            if (!hayFiltrosSeleccionados) return true;

            // El producto debe cumplir al menos con uno de los filtros aplicados
            return (filtros.modelo?.length ? cumpleModelo : false) || 
                   (filtros.funcion?.length ? cumpleFuncion : false) || 
                   (filtros.conectividad?.length ? cumpleConectividad : false) || 
                   (filtros.generales?.length ? cumpleGenerales : false);
        });

        setProductosFiltrados(filtrados);
    }, [productos]);

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
    }, [productos, busqueda, filtrarProductos]);


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
        <section>
            <header>
                <article className="BarraDeBusqueda">
                    <input type="text" placeholder="Buscar productos Epson (ej: L3110, EcoTank, tintas, cartuchos...)" value={busqueda} onChange={(texto) => {
                        const valor = texto.target.value;
                        setBusqueda(valor);
                        filtrarProductos(valor);
                    }}
                        className="search-input"
                    />
                </article>

                <article>
                    {busqueda && (
                        <p className="filter-info">
                            {productosFiltrados.length} productos encontrados <strong>"{busqueda}"</strong>
                        </p>
                    )}
                </article>
            </header>

            <Sidebar categoriasFiltradas={filtrarProductos}/>

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

                    <>{
                        productosFiltrados.map((producto) => (
                            <ProductCard
                                key={producto.item_id}
                                itemId={producto.item_id}
                                sku={producto.sku}
                                name={producto.name}
                                description={producto.description}
                                price={producto.rate}
                                
                                productCategory={producto.product_category}
                                stock_on_hand ={producto.stock_on_hand}
                                status={producto.status}
                                brand={producto.brand}
                                manufacturer={producto.manufacturer}
                            />
                        ))
                    }
                    </>
                )}
            </main>

        </section>
    );
}

export default Main;