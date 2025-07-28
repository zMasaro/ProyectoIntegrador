/**
 * Componente de filtro con subcategorías y offcanvas responsivo.
 *
 * @param {Array} categories - Categorías con título y opciones.
 * @param {Function} onChange - Callback con filtros seleccionados.
 * @param {Boolean} isOpen - Estado de visibilidad del sidebar.
 * @param {Function} onClose - Función para cerrar el sidebar.
 */

import { useState } from 'react';

function BrandFilter({ categories, onChange, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleToggle = (categoryKey, option) => {
    const current = selectedOptions[categoryKey] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];

    const newSelected = {
      ...selectedOptions,
      [categoryKey]: updated,
    };

    setSelectedOptions(newSelected);
    onChange(newSelected);
  };

  return (
    <aside className={`sidebar-container offcanvas ${isOpen ? 'open' : ''}`}>
      {/* Botón cerrar para móviles */}
      <button className="btn-close-sidebar" onClick={onClose}>×</button>

      <div className="search-box global-search">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {categories.map((category, i) => (
        <div className="filter-group" key={i}>
          <h4 className="filter-title">{category.title}</h4>
          <ul className="brand-list">
            {category.options
              .filter(opt => opt.toLowerCase().includes(searchTerm))
              .map((option, j) => (
                <li key={j} className="brand-item">
                  <input
                    type="checkbox"
                    id={`${category.key}-${j}`}
                    checked={selectedOptions[category.key]?.includes(option) || false}
                    onChange={() => handleToggle(category.key, option)}
                  />
                  <label htmlFor={`${category.key}-${j}`}>{option}</label>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

export default BrandFilter;


