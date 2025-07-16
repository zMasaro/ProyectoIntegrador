import express from 'express'
import { encryptPassword, verifyPassword } from '../utils/encryption'

const router = express.Router()

/**
 * Ruta: POST /encryption
 * Descripción: Obtiene la encriptacion de la contraseña que se almacenara
 * Respuesta: JSON con la contraseña encriptada
 */

router.post('/encryption', async (req, res) => {
  try {
    const { password } = req.body
    res.status(201).send(await encryptPassword(password))
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    } else {
      res.status(400).send('Error desconocido')
    }
  }
})


/**
 * Ruta: POST /verifypass
 * Descripción: Compara la contraseña del login, con la encriptacion de la Base de datos.
 * Respuesta: JSON con un respueta booleana 
 */

router.post('/verifypass', async (req, res) => {
  try {
    const { password, hash } = req.body
    const isValid = await verifyPassword(password, hash)
    res.status(200).send({ isValid })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    } else {
      res.status(400).send('Error desconocido')
    }
  }
})

export default router