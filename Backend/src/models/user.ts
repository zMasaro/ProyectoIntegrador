export interface User {
    id?: number;
    name: string;
    lastName: string;
    email: string;
    password: string;
    rol: number;
}

export type UserLogin = Pick<User, 'email' | 'password'>;

/**
 * Verifica si el Email cumple con las caracteristicas
 * 
 * @const  regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 * 
 * @param email - dato a validar.
 * 
 * @return Devuelve true si el email cumple con los requerimientos
 */

export function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/**
 * Verifica que la contraseña tenga los caracteres validos para
 * cumplir con los requrimientos de seguridad
 * 
 * @const  regexGeneral = /^[a-zA-Z0-9@$#*%_+]{12,20}$/;
 * 
 * @param password - dato a validar.
 * 
 * @return Devuelve true si la contraseña cumple con los requerimientos
 * 
 * @error Si no cumple lanza un error que especifica el incumplimiento 
 * 
 */


export function validatePassword(password: string): boolean{
    const regexGeneral = /^[a-zA-Z0-9@$#*%_+]{12,20}$/;
    if (!password) {
        throw new Error('Debe ingresar una contraseña.');
    } else if (!regexGeneral.test(password)) {
        throw new Error ('La contraseña debe tener entre 12 y 20 caracteres y solo puede contener letras, números y los caracteres especiales (@, $, #, *, %, _, +).');
    } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        throw new Error ('La contraseña debe contener al menos una letra mayúscula y una letra minúscula.');
    } else if (!/[0-9]/.test(password)) {
        throw new Error('La contraseña debe contener al menos un número.');
    } else if (!/[@$#*%_+]/.test(password)) {
        throw new Error('La contraseña debe contener al menos un carácter especial (@, $, #, *, %, _, +).');
    }
    return true;
}