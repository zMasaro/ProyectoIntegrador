/**
 * Script de prueba para la renovación automática de tokens de Zoho
 * Este script te permite probar que el sistema de renovación funciona correctamente
 */

import dotenv from 'dotenv';
dotenv.config();

import { refreshAccessToken, getCurrentToken, initializeTokenRefresh } from '../src/config/zoho.config';

async function testTokenRefresh() {
  console.log('Iniciando pruebas del sistema de renovación de tokens...\n');

  try {
    // Verificar variables de entorno
    console.log('1. Verificando configuración...');
    console.log(`ZOHO_CLIENT_ID: ${process.env.ZOHO_CLIENT_ID ? 'Configurado' : 'Faltante'}`);
    console.log(`ZOHO_CLIENT_SECRET: ${process.env.ZOHO_CLIENT_SECRET ? 'Configurado' : 'Faltante'}`);
    console.log(`ZOHO_REFRESH_TOKEN: ${process.env.ZOHO_REFRESH_TOKEN ? 'Configurado' : 'Faltante'}`);
    console.log(`ZOHO_ORG_ID: ${process.env.ZOHO_ORG_ID || 'Faltante'}\n`);

    // Probar obtención del token actual
    console.log('2. Obteniendo token actual...');
    const currentToken = await getCurrentToken();
    console.log(`Token actual: ${currentToken.substring(0, 20)}...\n`);

    // Probar renovación de token
    console.log('3. Probando renovación de token...');
    const newToken = await refreshAccessToken();
    console.log(`Nuevo token: ${newToken.substring(0, 20)}...\n`);

    // Inicializar sistema automático
    console.log('4. Iniciando sistema automático...');
    initializeTokenRefresh();
    console.log('Sistema automático iniciado\n');

    console.log('Todas las pruebas pasaron exitosamente!');
    console.log('El sistema renovará automáticamente el token cada 50 minutos');
    
  } catch (error) {
    console.error('Error en las pruebas:', error);
    console.log('\nPasos para solucionar:');
    console.log('1. Verifica que todas las variables estén en el .env');
    console.log('2. Asegúrate de que el refresh_token sea válido');
    console.log('3. Revisa que el client_id y client_secret sean correctos');
    console.log('4. Consulta el archivo ZOHO_OAUTH_SETUP.md para más información');
  }
}

// Ejecutar las pruebas
testTokenRefresh();
