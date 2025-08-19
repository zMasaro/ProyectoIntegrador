import { getconnection, mssql } from "../config/ConnectionSqlServer";
import { encryptPassword } from "../utils/encryption";

export const getUsers = async () => {
  try {
    const pool = await getconnection();
    if (!pool) {
      console.error("No se pudo establecer conexión con la base de datos.");
      return [];
    }

    const result = await pool.request().execute("spObtenerUsuarios");

    // Mapear columnas a los nombres que espera React
    return result.recordset.map(u => ({
      id: u.Id,
      name: u.Name,
      lastName: u.LastName,
      email: u.Email,
      rol: u.IdRol === 1 ? "Administrador" : "Técnico"
    }));

  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const changePassword = async (id: number, newPassword: string) => {
  try {
    const pool = await getconnection();
    if (!pool) {
      console.error("No se pudo establecer conexión con la base de datos.");
      return;
    }

    const hashed = await encryptPassword(newPassword);
    await pool.request()
      .input("UserId", mssql.Int, id)
      .input("PasswordHash", mssql.VarChar(255), hashed)
      .execute("spCambiarContrasena");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (id: number) => {
  try {
    const pool = await getconnection();
    if (!pool) {
      console.error("No se pudo establecer conexión con la base de datos.");
      return;
    }

    await pool.request()
      .input("UserId", mssql.Int, id)
      .execute("spEliminarUsuario");
  } catch (error: any) {
    throw new Error(error.message);
  }
};
