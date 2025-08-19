import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "../styles/AdminUser.css";

// Funciones de validación
function validatePasswordRules(password) {
  return {
    length: password.length >= 12 && password.length <= 20,
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$#*%_+]/.test(password),
  };
}

function AdminUsers({ onClose }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [rulesStatus, setRulesStatus] = useState({
    length: false,
    case: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users");
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        alert("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleOpenCambiarContrasena = (usuario) => {
    setSelectedUser(usuario);
    setShowPasswordModal(true);
    setNewPassword("");
    setRulesStatus({ length: false, case: false, number: false, special: false });
  };

  const handleCloseCambiarContrasena = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setNewPassword("");
    setRulesStatus({ length: false, case: false, number: false, special: false });
  };

  const handleChangePasswordInput = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setRulesStatus(validatePasswordRules(value));
  };

  const handleGuardarPassword = async (e) => {
    e.preventDefault();

    // Si alguna regla no se cumple, no enviar
    if (Object.values(rulesStatus).includes(false)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/users/${selectedUser.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (res.ok) {
        setMensaje(`Contraseña de ${selectedUser.name} ${selectedUser.lastName} actualizada correctamente`);
        handleCloseCambiarContrasena();
      } else {
        const data = await res.json();
        alert(data.message || "Error al cambiar la contraseña");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Error al eliminar el usuario");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <>
      <Modal title="Administrar Usuarios" onClose={onClose}>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <>
            {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
            <div className="adm-table-container">
  <table className="adm-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {usuarios.map((u) => (
        <tr key={u.id}>
          <td data-label="ID">{u.id}</td>
          <td data-label="Nombre">{u.name} {u.lastName}</td>
          <td data-label="Correo">{u.email}</td>
          <td data-label="Rol">{u.rol}</td>
          <td data-label="Acciones">
            <button
              className="adm-btn adm-btn-cambiar"
              onClick={() => handleOpenCambiarContrasena(u)}
            >
              Cambiar contraseña
            </button>
            <button
              className="adm-btn adm-btn-eliminar"
              onClick={() => handleEliminar(u.id)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          </>
        )}
      </Modal>

      {showPasswordModal && (
        <Modal title={`Cambiar contraseña - ${selectedUser?.name} ${selectedUser?.lastName}`} onClose={handleCloseCambiarContrasena}>
          <form onSubmit={handleGuardarPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva contraseña</label>
              <input
                id="newPassword"
                type="password"
                className="adm-input"
                value={newPassword}
                onChange={handleChangePasswordInput}
              />
              <ul style={{ marginTop: "5px", listStyleType: "disc", paddingLeft: "20px", fontSize: "0.9em" }}>
                <li style={{ color: rulesStatus.length ? "green" : "red" }}>Entre 12 y 20 caracteres</li>
                <li style={{ color: rulesStatus.case ? "green" : "red" }}>Al menos una letra mayúscula y una minúscula</li>
                <li style={{ color: rulesStatus.number ? "green" : "red" }}>Al menos un número</li>
                <li style={{ color: rulesStatus.special ? "green" : "red" }}>Al menos un carácter especial (@, $, #, *, %, _, +)</li>
              </ul>
            </div>
            <div className="modal-actions">
              <button type="submit" className="adm-btn adm-btn-cambiar" disabled={Object.values(rulesStatus).includes(false)}>
                Guardar
              </button>
              <button type="button" className="adm-btn adm-btn-eliminar" onClick={handleCloseCambiarContrasena}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default AdminUsers;
