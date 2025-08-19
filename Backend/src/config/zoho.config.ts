/**
 * Configuración para la integración con Zoho Inventory API
 * Incluye sistema de renovación automática de tokens
 * 
 * Variables de entorno requeridas:
 * - ZOHO_AUTH_TOKEN: Token de autenticación OAuth de Zoho (se renueva automáticamente)
 * - ZOHO_CLIENT_ID: ID de cliente OAuth de Zoho
 * - ZOHO_CLIENT_SECRET: Secret de cliente OAuth de Zoho
 * - ZOHO_REFRESH_TOKEN: Token de refresh permanente
 * - ZOHO_ORG_ID: ID de la organización en Zoho Inventory
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Configuración de URLs y endpoints
export const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';
export const ZOHO_INVENTORY_URL = process.env.ZOHO_INVENTORY_URL || 'https://www.zohoapis.com';

// Credenciales OAuth
export const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
export const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
export const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';

// Token de autenticación actual (puede cambiar)
export let ZOHO_AUTH_TOKEN = process.env.ZOHO_AUTH_TOKEN || '';

// ID de la organización en Zoho Inventory
export const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID || '';

// Variable para almacenar el timeout de renovación
let refreshTokenTimer: NodeJS.Timeout | null = null;

/**
 * Renueva el token de autenticación usando el refresh token
 * @returns Promise<string> - Nuevo token de autenticación
 */
export async function refreshAccessToken(): Promise<string> {
  try {
    console.log('Renovando token de Zoho...');
    
    const response = await axios.post(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, null, {
      params: {
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      }
    });

    if (response.data.access_token) {
      ZOHO_AUTH_TOKEN = response.data.access_token;
      
      // Actualizar el archivo .env con el nuevo token
      await updateEnvFile(ZOHO_AUTH_TOKEN);
      
      console.log('Token renovado exitosamente');
      console.log('Proxima renovacion en 50 minutos');
      
      // Programar la siguiente renovación (50 minutos para estar seguros)
      scheduleTokenRefresh();
      
      return ZOHO_AUTH_TOKEN;
    } else {
      throw new Error('No se recibió un token válido en la respuesta');
    }
  } catch (error) {
    console.error('Error renovando token de Zoho:', error);
    throw error;
  }
}

/**
 * Actualiza el archivo .env con el nuevo token
 * @param newToken - Nuevo token de autenticación
 */
async function updateEnvFile(newToken: string): Promise<void> {
  try {
    const envPath = path.join(__dirname, '../../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Reemplazar el token en el archivo .env
    const tokenRegex = /ZOHO_AUTH_TOKEN=.*/;
    envContent = envContent.replace(tokenRegex, `ZOHO_AUTH_TOKEN=${newToken}`);
    
    fs.writeFileSync(envPath, envContent);
    
    // Actualizar la variable de entorno en el proceso actual
    process.env.ZOHO_AUTH_TOKEN = newToken;
  } catch (error) {
    console.error('Error actualizando archivo .env:', error);
  }
}

/**
 * Programa la próxima renovación del token
 */
function scheduleTokenRefresh(): void {
  // Limpiar el timer anterior si existe
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
  }
  
  // Renovar en 50 minutos (3000000 ms) para estar seguros antes de que expire
  refreshTokenTimer = setTimeout(() => {
    refreshAccessToken().catch(error => {
      console.error('Error en renovación automática:', error);
      // Intentar de nuevo en 5 minutos si falla
      setTimeout(() => refreshAccessToken(), 5 * 60 * 1000);
    });
  }, 50 * 60 * 1000);
}

/**
 * Obtiene el token actual, renovándolo si es necesario
 * @returns Promise<string> - Token de autenticación válido
 */
export async function getCurrentToken(): Promise<string> {
  if (!ZOHO_AUTH_TOKEN) {
    console.log('No hay token disponible, obteniendo uno nuevo...');
    return await refreshAccessToken();
  }
  return ZOHO_AUTH_TOKEN;
}

/**
 * Inicializa el sistema de renovación automática de tokens
 */
export function initializeTokenRefresh(): void {
  console.log('Iniciando sistema de renovación automática de tokens de Zoho');
  
  // Verificar que tenemos las credenciales necesarias
  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    console.warn('Faltan credenciales OAuth. La renovación automática no funcionará.');
    console.warn('Asegúrate de configurar ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET y ZOHO_REFRESH_TOKEN en el .env');
    return;
  }
  
  // Programar la primera renovación
  scheduleTokenRefresh();
  
  console.log('Sistema de renovación automática iniciado');
}

/**
 * Detiene el sistema de renovación automática
 */
export function stopTokenRefresh(): void {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = null;
    console.log('Sistema de renovación automática detenido');
  }
}
