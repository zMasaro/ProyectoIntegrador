import { verifyPassword } from '../utils/encryption';
import { getconnection, mssql } from '../config/ConnectionSqlServer';
import { User } from './user';

export const LoginUser = async (email: string, password: string): Promise<User | void> => {
  try {
    const pool = await getconnection();
    if (!pool) {
      console.error('No se puedo establecer conexion a la base de datos');
      return;
    }

    const result = await pool.request()
      .input('email', mssql.VarChar, email)
      .query('SELECT * from TbUsers WHERE email = @email');

    const user = result.recordset[0];
    if (!user) {
      console.error('Usuario no encontrado');
      return;
    }

    const ispasswordvalid = await verifyPassword(password, user.PasswordHash);
    if (!ispasswordvalid) {
      console.error('contraseña incorrecta');
      return;
    }

    return {
      email: user.Email,
      name: user.Name,
      lastName: user.LastName,
      password: user.PasswordHash, // mapeo passwordHash a password
      rol: user.IdRol
    } as User;

  } catch (error) {
    console.error(error);
  }
};
