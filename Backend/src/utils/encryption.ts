import bcrypt from 'bcrypt'

/**
 * Encripta la contraseña y aplica los salt necesarios para
 * la seguridad.
 * 
 * @param password - Contraseña que se encriptara.
 * 
 * @return Devuelve el hash de la contraseña encriptada
 */

export async function encryptPassword (password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Compara la contraseña con el hash
 * 
 * @param password - Contraseña que se encriptara.
 * @param hash - Dato hash a comparar posteriormente.
 * 
 * @return Devuelve un booleano, true si coniciden, false si son distinto.
 */

export async function verifyPassword (password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}