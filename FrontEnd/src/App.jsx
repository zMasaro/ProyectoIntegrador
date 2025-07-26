import React, { useEffect, useState } from 'react';
import { obtenerProductos } from './services/zoho';
//import './App.css';
//import Login from './pages/Login.jsx'; 
//import SingUp from './pages/SignUp.jsx';
import SidebarPage from './pages/Sidebar';




function App() {
 return ( 
  <SidebarPage />
 );  
}
export default App;


  /**
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   * Efecto que se ejecuta al montar el componente
   * Carga los productos Epson desde la API
   
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setError(null);
        const data = await obtenerProductos();
        setProductos(data.items || []); 
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setError('Error al cargar los productos Epson. Verifica que el servidor esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🖨️ Inventario de Productos Epson</h1>
        <p>Catálogo completo desde Zoho Inventory</p>
      </header>
      
      <main className="app-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>🔍 Buscando productos Epson...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="products-container">
            <div className="products-header">
              <h2>✅ Productos encontrados: {productos.length}</h2>
            </div>
            
            <div className="products-grid">
              {productos.map((producto) => (
                <div key={producto.item_id} className="product-card">
                  <div className="product-header">
                    <h3 className="product-name">{producto.name}</h3>
                    <span className="product-sku">SKU: {producto.sku}</span>
                  </div>
                  
                  <div className="product-details">
                    {producto.description && (
                      <p className="product-description">
                        <strong>Descripción:</strong> {producto.description}
                      </p>
                    )}
                    
                    <div className="product-info">
                      <span className="product-id">ID: {producto.item_id}</span>
                      {producto.rate && (
                        <span className="product-price">Precio: ${producto.rate}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );*/

