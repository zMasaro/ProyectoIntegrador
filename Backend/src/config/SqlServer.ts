import { getconnection, mssql } from './ConnectionSqlServer';

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
    email: string,
    name: string,
    LastName: string,
  password: string,
  IdRol: number
): Promise<void> => {
  try {
    const pool = await getconnection();
    if (!pool) {
      console.error('No se pudo establecer conexión con la base de datos.');
      return;
    }

    const result = await pool.request()
      .input('email', mssql.VarChar, email)
      .input('name', mssql.VarChar, name)
      .input('LastName', mssql.VarChar, LastName) //
      .input('passwordHash', mssql.VarChar, password)
      .input('IdRol', mssql.Int, IdRol)
       .execute('dbo.spCrearUsuario');

    console.log(result);
  } catch (error: any) {
    const message=error.message
    console.log({message})
  }
};

const main = async (): Promise<void> => {
  await AddUser('user8@mail.com', 'charly', 'Flow', 'hash123', 1);
  await getUser();
};

main();