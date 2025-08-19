import React, { useState } from "react";
import CustomButton from "../components/CustomButton";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [idRol, setIdRol] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, lastName, password, rol: parseInt(idRol) }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setEmail(""); setName(""); setLastName(""); setPassword(""); setIdRol("");
      } else {
        setError(data.message || "Error al registrar");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="SignUpTitle">Registro de Usuario</h2>
      <label className="SignUpEmail" htmlFor="Email">Correo electrónico:</label>
      <br/>
      <input className="SignUpInputEmail" type="email" name="Email" placeholder="Correo" required value={email} onChange={e => setEmail(e.target.value)} />
      <br/>
      <label className="SignUpName" htmlFor="Name">Nombre:</label>
      <br/>
      <input className="SignUpInputName" type="text" name="Name" placeholder="Nombre" required value={name} onChange={e => setName(e.target.value)} />
      <br/>
      <label className="SignUpLastName" htmlFor="LastName">Apellido:</label>
      <br/>
      <input className="SignUpInputLastName" type="text" name="LastName" placeholder="Primer Apellido" required value={lastName} onChange={e => setLastName(e.target.value)} />
      <br/>
      <label className="SignUpPassword" htmlFor="Password">Contraseña:</label>
      <br/>
      <input className="SignUpInputPassword" type="password" name="Password" placeholder="Contraseña" required value={password} onChange={e => setPassword(e.target.value)} />
      <br/>
       <label className="SignUpIdRol" htmlFor="Rol">Rol:</label>
       <select
        className="SignUpInputIdRol"
        id="Rol"
        required
        value={idRol}
       onChange={(e) => setIdRol(e.target.value)}
     >
        <option value="">Seleccione un rol</option>
       <option value="1">Administrador</option>
       <option value="2">Técnico</option>
       </select>      <br/>
       <CustomButton
         text="Registrar"
         type="submit"
         id="SignUpButton"
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
    </form>
  );
}

export default SignUp;