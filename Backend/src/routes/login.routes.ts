import express from 'express';
import { LoginUser } from '../models/login';
const router = express.Router();

// Endpoint de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y contraseña requeridos' });

  try {
    const user = await LoginUser(email, password);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Guardar sesión
    req.session.user = {
      email: user.email,
      name: user.name,
      rol: user.rol
    };

    res.json({  name: user.name, rol: user.rol });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;