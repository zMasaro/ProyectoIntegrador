import { encryptPassword } from '../utils/encryption';
import { getconnection, mssql } from '../config/ConnectionSqlServer';
import { User } from './user';

export const AddUser = async (user: User): Promise<void> => {
  try {
    const pool = await getconnection();
    if (!pool) {
      console.error('No se pudo establecer conexión con la base de datos.');
      return;
    }

    const hashedPassword = await encryptPassword(user.password);
    const result = await pool.request()
      .input('email', mssql.VarChar, user.email)
      .input('name', mssql.VarChar, user.name)
      .input('LastName', mssql.VarChar, user.lastName)
      .input('passwordHash', mssql.VarChar(100), hashedPassword)
      .input('IdRol', mssql.Int, user.rol)
      .execute('dbo.spCrearUsuario');

    console.log(result);
  } catch (error: any) {
    const message = error.message;
    throw new Error(message);
  }
};
