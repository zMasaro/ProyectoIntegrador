import express from "express";
import { getUsers, changePassword, deleteUser } from "../models/adminUser";
import { validatePassword } from "../models/user"; // <--- importamos la función

const router = express.Router();

// Obtener todos los usuarios
router.get("/users", async (req, res) => {
  try {
    const usuarios = await getUsers();
    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Cambiar contraseña
router.put("/users/:id/password", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ message: "Falta la nueva contraseña" });

  try {
    validatePassword(newPassword);

    await changePassword(parseInt(id), newPassword);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error: any) {
    res.status(400).json({ message: error.message }); 
  }
});

// Eliminar usuario
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteUser(parseInt(id));
    res.json({ message: "Usuario eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
