import CustomButton from "../components/CustomButton";
import "../styles/Login.css";
import InjaconBlanco from "../img/InjaconBlanco.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Para enviar cookies de sesión
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Login exitoso, mostrar mensaje personalizado
        localStorage.setItem("rol", data.rol); // guardar el rol en localStorage
        navigate("/app"); // Redirigir a la aplicación principal
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="login-container">
      <img src={InjaconBlanco} alt="Injacom Logo" />
      <h3>Iniciar Sesión</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <CustomButton
          text="Iniciar Sesión"
          type="submit"
          id="save-button"
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}

export default Login;