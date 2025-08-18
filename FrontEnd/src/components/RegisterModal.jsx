import React, { useState } from "react";
import Modal from "./Modal";
import CustomButton from "./CustomButton";

// Validaciones
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regexGeneral = /^[a-zA-Z0-9@$#*%_+]{12,20}$/;
  return {
    length: regexGeneral.test(password),
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[@$#*%_+]/.test(password),
  };
}

function RegisterModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [idRol, setIdRol] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailValid = email ? validateEmail(email) : true;
  const passwordRules = password ? validatePassword(password) : {
    length: false, upperLower: false, number: false, specialChar: false
  };
  const allPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!emailValid) return setError("Correo inválido");
    if (!allPasswordValid) return setError("La contraseña no cumple con los requisitos");

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
    } catch {
      setError("Error de conexión");
    }
  };

  const ruleStyle = (valid) => ({ color: valid ? "green" : "red", margin: "2px 0" });

  return (
    <Modal title="Registrar Usuario" onClose={onClose}>
      <form 
        onSubmit={handleSubmit} 
        style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "450px", margin: "0 auto" }}
      >
        {/* EMAIL */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="email">Correo electrónico</label>
          <input 
            id="email"
            type="email" 
            placeholder="user@gmail.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ padding: "8px", borderRadius: "5px", border: emailValid ? "1px solid #ccc" : "1px solid red" }}
          />
          {!emailValid && <small style={{ color: "red" }}>Correo inválido</small>}
        </div>

        {/* NOMBRE Y APELLIDO EN LA MISMA FILA */}
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="name">Nombre</label>
            <input 
              id="name"
              type="text" 
              placeholder="Nombre" 
              value={name} 
              onChange={e => setName(e.target.value)}
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="lastName">Apellido</label>
            <input 
              id="lastName"
              type="text" 
              placeholder="Apellido" 
              value={lastName} 
              onChange={e => setLastName(e.target.value)}
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        {/* CONTRASEÑA */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="password">Contraseña</label>
          <input 
            id="password"
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={{ padding: "8px", borderRadius: "5px", border: allPasswordValid ? "1px solid #ccc" : "1px solid red" }}
          />
         <ul style={{
  listStyle: "none",
  padding: "10px",
  backgroundColor: "#f8f8f8",
  borderRadius: "8px",
  fontSize: "0.9em"
}}>
  <li style={{ color: passwordRules.length ? "green" : "red" }}>
    {passwordRules.length ? "✔️" : "❌"} 12-20 caracteres
  </li>
  <li style={{ color: passwordRules.upperLower ? "green" : "red" }}>
    {passwordRules.upperLower ? "✔️" : "❌"} Mayúscula y minúscula
  </li>
  <li style={{ color: passwordRules.number ? "green" : "red" }}>
    {passwordRules.number ? "✔️" : "❌"} Número
  </li>
  <li style={{ color: passwordRules.specialChar ? "green" : "red" }}>
    {passwordRules.specialChar ? "✔️" : "❌"} Carácter especial
  </li>
</ul>



        </div>

        {/* ROL */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="rol">Rol</label>
          <select 
            id="rol"
            value={idRol} 
            onChange={e => setIdRol(e.target.value)} 
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="1">Administrador</option>
            <option value="2">Técnico</option>
          </select>
        </div>

        <CustomButton 
        style={{ backgroundColor:"green" ,color :"white" }}
          text="Registrar" 
          type="submit" 
          disabled={!emailValid || !allPasswordValid || !idRol || !name || !lastName} 
        />

        {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: "5px" }}>{success}</p>}
      </form>
    </Modal>
  );
}

export default RegisterModal;
