import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import LogoutButton from "./LogoutButton.jsx";

export default function Navbar({
  query = "",
  results = 0,
  onQueryChange = () => {},
  logoSrc = "/img/InjaconLogo.png",
  rol = null,
  onRegisterClick = () => {},
  onAdministrarClick = () => {},
}) {


  return (
    <nav className="ep-nav" role="navigation" aria-label="Catálogo Epson">
      <div className="ep-nav__inner">
        {/* Izquierda: logo */}
        <div className="ep-nav__left">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="ep-nav__logo" />
          ) : (
            <span className="ep-nav__brand-icon" aria-hidden />
          )}
        </div>

        {/* Centro */}
        <div className="ep-nav__center" />

        {/* Derecha: buscador + botones */}
        <div className="ep-nav__right">
          <label htmlFor="ep-search" className="ep-sr-only">
            Buscar productos
          </label>
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

          {rol === 1 && (
            <button
              type="button"
              className="ep-btn ep-btn--primary"
              onClick={onRegisterClick}
            >
              Registrar usuarios
            </button>
          )}

          <button
            type="button"
            className="ep-btn ep-btn--outline"
            onClick={onAdministrarClick}
          >
            Administrar Usuarios
          </button>
          {rol && <LogoutButton />}


          {query && (
            <span className="ep-nav__results-pill">{results} resultados</span>
          )}
        </div>
      </div>
    </nav>
  );
}
