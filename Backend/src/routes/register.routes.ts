import { AddUser } from "../models/signup";
import express from "express";
import { validateEmail, validatePassword } from "../models/user"; 

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, name, lastName, password, rol } = req.body;

  if (!email || !name || !lastName || !password || !rol) {
    return res.status(400).json({ message: "Debe llenar todos los campos" });
  }

  try {
    // Validaciones del frontend en el backend 
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Correo no tiene un formato válido" });
    }

    validatePassword(password); 

    const user = await AddUser({ email, name, lastName, password, rol });

    res.json({ message: "Usuario registrado correctamente", user });
  } catch (error: any) {

    return res.status(400).json({ message: error.message });
  }
});

export default router;
