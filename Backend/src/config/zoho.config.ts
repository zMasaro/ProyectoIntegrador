/**
 * Configuración para la integración con Zoho Inventory API
 * 
 * Variables de entorno requeridas:
 * - ZOHO_AUTH_TOKEN: Token de autenticación OAuth de Zoho
 * - ZOHO_ORG_ID: ID de la organización en Zoho Inventory
 */

// Token de autenticación para la API de Zoho Inventory
export const ZOHO_AUTH_TOKEN = process.env.ZOHO_AUTH_TOKEN || '';

// ID de la organización en Zoho Inventory
export const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID || '';
