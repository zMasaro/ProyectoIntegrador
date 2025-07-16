import * as mssql from 'mssql';

const ConnectionSettings: mssql.config = {
  server: 'localhost',
  database: 'Login',
  user: 'sa',
  password: 'Matias123',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function getconnection(): Promise<mssql.ConnectionPool | undefined> {
  try {
    return await mssql.connect(ConnectionSettings);
  } catch (error) {
    console.error(error);
  }
}

export { mssql };
