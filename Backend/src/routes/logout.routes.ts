// logout.routes.ts
import express from "express";

const router = express.Router();

router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(" Error al destruir la sesión:", err);
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }

      // Borra cookie de sesión (importante si usas express-session)
      res.clearCookie("connect.sid", {
        path: "/", // ajusta al path que uses en la cookie
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax",
      });

      return res.status(200).json({ message: "Sesión cerrada correctamente" });
    });
  } else {
    // Si no hay sesión activa
    return res.status(200).json({ message: "No hay sesión activa" });
  }
});

export default router;
