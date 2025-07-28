import { useState } from 'react';
import BrandFilter from '../components/BrandFilter';
import "../styles/Sidebar.css";

const categorias = [
  {
    title: 'Modelo Epson',
    key: 'modelo',
    options: ['EcoTank', 'WorkForce', 'Expression', 'SureColor'],
  },
  {
    title: 'Tipo de Función',
    key: 'funcion',
    options: ['Multifunción', 'Escáner', 'Fotográfica', 'Solo impresión'],
  },
  {
    title: 'Conectividad',
    key: 'conectividad',
    options: ['Wi-Fi', 'USB', 'Bluetooth', 'Ethernet'],
  },
];

function Sidebar() {
  const [mostrarSidebar, setMostrarSidebar] = useState(false);

  const handleChange = (selecciones) => {
    console.log('Filtros seleccionados:', selecciones);
  };

  const toggleSidebar = () => {
    setMostrarSidebar(!mostrarSidebar);
  };

  const closeSidebar = () => {
    setMostrarSidebar(false);
  };

  return (
    <div className="layout">
      {/* Botón solo visible en móvil */}
      <button className="btn-toggle-sidebar" onClick={toggleSidebar}>
        Filtros
      </button>

      {/* Overlay para cerrar tocando fuera */}
      {mostrarSidebar && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar como offcanvas */}
      <BrandFilter
        categories={categorias}
        onChange={handleChange}
        isOpen={mostrarSidebar}
        onClose={closeSidebar}
      />

      <main className="main-content">
        <h1>Catálogo Epson</h1>
        <p>Aquí puedes mostrar productos según los filtros seleccionados.</p>
      </main>
    </div>
  );
}

export default Sidebar;

