import CustomButton from "../components/CustomButton";
import "../styles/Login.css";
import InjaconBlanco from "../img/InjaconBlanco.jpg";

function Login() {
  return (
    <div className="login-container">
      <img src={InjaconBlanco} alt="Injacom Logo" />
      <h3>Iniciar Sesión</h3>
      <form>
        <input
          type="email"
          placeholder="Correo"
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          required
        />
        <br />
        <CustomButton
          text="Iniciar Sesión"
          type="submit"
          id="save-button"
        />
      </form>
    </div>
  );
}

export default Login;