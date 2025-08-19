import { useState } from 'react';
import BrandFilter from './BrandFilter';
import '../styles/Sidebar.css';
import { FaSearch, FaCogs, FaWifi, FaTags } from 'react-icons/fa';
import { MdPrint } from "react-icons/md";

const categorias = [
  {
    title: 'MODELO EPSON',
    key: 'modelo',
    icon: <MdPrint />,   
    options: ['EcoTank', 'WorkForce', 'Expression', 'SureColor'],
  },
  {
    title: 'TIPO DE FUNCIÓN',
    key: 'funcion',
    icon: <FaCogs />,
    options: ['Multifunción', 'Escaner', 'Impresora'],
  },
  {
    title: 'CONECTIVIDAD',
    key: 'conectividad',
    icon: <FaWifi />,
    options: ['Wi-Fi', 'USB', 'Bluetooth'],
  },
  {
    title: 'GENERALES',
    key: 'generales',
    icon: <FaTags />,
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




