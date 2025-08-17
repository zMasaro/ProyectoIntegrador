import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const rol = parseInt(localStorage.getItem("rol")); // Trae el rol guardado

  if (!rol) return <Navigate to="/" replace />; // No está logueado
  if (rol !== 1) return <Navigate to="/app" replace />; // No es admin

  return children; // Solo admin puede ver el componente
};

export default ProtectedAdminRoute;
