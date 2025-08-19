import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/logout", {
        method: "POST",
        credentials: "include", 
      });

      if (res.ok) {
        navigate("/"); 
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="ep-btn ep-btn--outline"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
