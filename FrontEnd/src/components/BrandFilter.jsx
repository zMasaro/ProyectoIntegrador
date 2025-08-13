import { useState } from 'react';

/**
 * Componente de filtro con subcategorías y búsqueda (aislado en CSS).
 *
 * @param {Array} categories - Categorías con título y opciones.
 * @param {Function} onChange - Callback con filtros seleccionados.
 */
function BrandFilter({ categories, onChange }) {
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
    <aside className="sb-filter-container">
      <div className="sb-search-box">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {categories.map((category, i) => (
        <div className="sb-filter-group" key={i}>
          <h4 className="sb-filter-title">{category.title}</h4>
          <ul className="sb-filter-list">
            {category.options
              .filter(opt => opt.toLowerCase().includes(searchTerm))
              .map((option, j) => (
                <li key={j} className="sb-filter-item">
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



