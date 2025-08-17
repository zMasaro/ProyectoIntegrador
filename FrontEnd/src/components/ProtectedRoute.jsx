import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/check-session", {
          credentials: "include",
        });
        const data = await res.json();
        setIsAuth(data.loggedIn); // 👈 valida el flag del backend
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkSession();
  }, []);

  if (isAuth === null) return <div>Cargando...</div>;
  if (!isAuth) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
