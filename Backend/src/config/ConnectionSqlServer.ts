import * as mssql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const ConnectionSettings: mssql.config = {
  server: String (process.env.DB_SERVER) ,
  database: String( process.env.DB_DATABASE),
  user: String (process.env.DB_USER) ,
  password: String (process.env.DB_PASSWORD) ,
  port: Number(process.env.DB_PORT),
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
