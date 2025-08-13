import React from "react";
import "../styles/Navbar.css"; // estilos con clases únicas ep-*

export default function Navbar({
  query = "",
  results = 0,
  onQueryChange = () => {},
   logoSrc="/img/InjaconLogo.png"                    // opcional: ruta del logo
}) {
  return (
    <nav className="ep-nav" role="navigation" aria-label="Catálogo Epson">
      <div className="ep-nav__inner">
        {/* Izquierda: logo + marca */}
        <div className="ep-nav__left">
          {logoSrc
            ? <img src={logoSrc} alt="Logo" className="ep-nav__logo" />
            : <span className="ep-nav__brand-icon" aria-hidden>🖨️</span>}
          <span className="ep-nav__brand-name">Inventario</span>
        </div>

        {/* Centro (por si luego agregas chips/tags) */}
        <div className="ep-nav__center" />

        {/* Derecha: buscador + botones + contador */}
        <div className="ep-nav__right">
          <label htmlFor="ep-search" className="ep-sr-only">Buscar productos</label>
          <input
            id="ep-search"
            type="text"
            className="ep-nav__search-input"
            placeholder="Buscar productos Epson (ej: L3110, EcoTank, tintas, cartuchos...)"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />

          <button type="button" className="ep-btn ep-btn--outline">
            Ver PDFs de impresoras
          </button>

          <button type="button" className="ep-btn ep-btn--primary">
            Registrar usuarios
          </button>

          {query && (
            <span className="ep-nav__results-pill">{results} resultados</span>
          )}
        </div>
      </div>
    </nav>
  );
}

