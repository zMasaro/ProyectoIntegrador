# Configuración OAuth para Zoho - Renovación Automática de Tokens

## ¿Por qué necesitas esto?

Los tokens de Zoho expiran cada 60 minutos. Este sistema permite que tu aplicación renueve automáticamente los tokens sin intervención manual.

## Pasos para configurar OAuth en Zoho

### 1. Crear una aplicación OAuth en Zoho

1. Ve a [Zoho API Console](https://api-console.zoho.com/)
2. Haz clic en **"Get Started"** o **"Add Client"**
3. Selecciona **"Self Client"** (para aplicaciones propias)
4. Llena los datos:
   - **Client Name**: Nombre de tu aplicación (ej: "Integrador Epson")
   - **Homepage URL**: `http://localhost:3001`
   - **Authorized Redirect URIs**: `http://localhost:3001/callback`

### 2. Obtener Client ID y Client Secret

Después de crear la aplicación, obtendrás:
- **Client ID**: Un código único de tu aplicación
- **Client Secret**: Clave secreta de tu aplicación

### 3. Generar el Refresh Token

#### Opción A: Usar el navegador (Recomendado)

1. Construye esta URL (reemplaza `TU_CLIENT_ID` con tu Client ID real):

```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoInventory.FullAccess.all&client_id=TU_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=http://localhost:3001/callback
```

2. Abre la URL en tu navegador
3. Autoriza la aplicación
4. Serás redirigido a `http://localhost:3001/callback?code=CODIGO_TEMPORAL`
5. Copia el `CODIGO_TEMPORAL` de la URL

#### Opción B: Usar curl

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=TU_CLIENT_ID" \
  -d "client_secret=TU_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:3001/callback" \
  -d "code=CODIGO_TEMPORAL"
```

### 4. Obtener el Refresh Token

Con el código temporal, haz esta petición:

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=TU_CLIENT_ID" \
  -d "client_secret=TU_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:3001/callback" \
  -d "code=CODIGO_TEMPORAL"
```

La respuesta incluirá:
```json
{
  "access_token": "token_temporal",
  "refresh_token": "ESTE_ES_EL_QUE_NECESITAS",
  "expires_in": 3600
}
```

## Configuración del .env

Actualiza tu archivo `.env` con los valores obtenidos:

```env
# Token actual de Zoho (se renueva automáticamente)
ZOHO_AUTH_TOKEN=1000.bf32622739013373a2b2b1fa5d887bcc.28053bee02551ca4a3818871d429663d

# Credenciales OAuth de Zoho (permanentes)
ZOHO_CLIENT_ID=1000.TU_CLIENT_ID_AQUI
ZOHO_CLIENT_SECRET=TU_CLIENT_SECRET_AQUI
ZOHO_REFRESH_TOKEN=1000.TU_REFRESH_TOKEN_AQUI

# Configuración de la aplicación
ZOHO_ORG_ID=751498119
PORT=3001

# URLs de Zoho API
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_INVENTORY_URL=https://www.zohoapis.com
```

## Verificación

Una vez configurado, tu aplicación:

1. Iniciará con el token actual
2. Renovará automáticamente el token cada 50 minutos
3. Guardará el nuevo token en el archivo .env
4. Manejará errores de token expirado automáticamente

## Comandos útiles para testing

### Probar renovación manual:
```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=refresh_token" \
  -d "client_id=TU_CLIENT_ID" \
  -d "client_secret=TU_CLIENT_SECRET" \
  -d "refresh_token=TU_REFRESH_TOKEN"
```

### Probar la API:
```bash
curl -H "Authorization: Zoho-oauthtoken TU_TOKEN" \
     -H "X-com-zoho-inventory-organizationid: 751498119" \
     "https://www.zohoapis.com/inventory/v1/items?search_text=epson"
```

## Seguridad

- El archivo `.env` está en `.gitignore`
- Nunca commits credenciales al repositorio
- Los refresh tokens no expiran (a menos que los revokes)
- El sistema maneja errores automáticamente

## Soporte

Si tienes problemas:
1. Verifica que todas las credenciales estén correctas
2. Revisa los logs de la consola para errores específicos
3. Asegúrate de que el Organization ID sea correcto
