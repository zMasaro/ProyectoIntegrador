import { useState } from 'react';
import BrandFilter from '../components/BrandFilter';
import '../styles/Sidebar.css';
import { FaSearch } from 'react-icons/fa';

const categorias = [
  {
    title: 'Modelo Epson',
    key: 'modelo',
    options: ['EcoTank', 'WorkForce', 'Expression', 'SureColor'],
  },
  {
    title: 'Tipo de Función',
    key: 'funcion',
    options: ['Multifunción', 'Escaner', 'Impresora'],
  },
  {
    title: 'Conectividad',
    key: 'conectividad',
    options: ['Wi-Fi', 'USB', 'Bluetooth'],
  },
  {
    title: 'Generales',
    key: 'generales',
    options: ['Tinta', 'Cartucho', 'Laser', 'Sublimación'],
  },
];

function Sidebar({ categoriasFiltradas }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  const hayChecksActivos = Object.values(selectedOptions).some(arr => arr.length > 0);

  const handleChange = (selecciones) => {
    setSelectedOptions(selecciones);
    categoriasFiltradas(selecciones);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    if (!hayChecksActivos) setIsHovered(false);
  };

  return (
    <div className={`sb-layout ${isHovered ? 'sb-expanded' : 'sb-collapsed'}`}>
      <div
        className="sb-sidebar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isHovered ? (
          <BrandFilter categories={categorias} onChange={handleChange} />
        ) : (
          <div className="sb-icon-only">
            <FaSearch className="sb-icon" title="Buscar" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;




