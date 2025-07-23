import { encryptPassword } from '../utils/encryption';
import { getconnection, mssql } from './ConnectionSqlServer';
import {User} from '../models/user';

// Función para obtener usuarios
const getUser = async (): Promise<void> => {
  try {
    const pool = await getconnection();
    if (!pool) {
      console.error('No se pudo establecer conexión con la base de datos.');
      return;
    }

    const result = await pool.request().query('SELECT * FROM TbUsers');
    console.table(result.recordset);
    console.log("Listado");
  } catch (error) {
    console.error(error);
  }
};

// Función para agregar un usuario
const AddUser = async (
   User: User
): Promise<void> => {
  try {
    const pool = await getconnection();
    if (!pool) {
      console.error('No se pudo establecer conexión con la base de datos.');
      return;
    }

    const hashedPassword = await encryptPassword(User.password)
    const result = await pool.request()
      .input('email', mssql.VarChar,  User.email)
      .input('name', mssql.VarChar, User.name)
      .input('LastName', mssql.VarChar, User.lastName) //
      .input('passwordHash', mssql.VarChar(100), hashedPassword)
      .input('IdRol', mssql.Int, User.rol)
       .execute('dbo.spCrearUsuario');

    console.log(result);
  } catch (error: any) {
    const message=error.message
    console.log({message})
  }
};

const main = async (): Promise<void> => {
  const newUser: User = {
    email: 'user1@mail.com',
    name: 'charly',
    lastName: 'Flow',
    password: 'hash123',
    rol: 1
  };
  
  await AddUser(newUser);
  await getUser();
};

main();