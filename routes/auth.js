const express = require("express")
const { validatorRegister, validatorLogin, validatorNewPasswd } = require("../validators/auth")
const { validatorCode } = require('../validators/code')
const { registerCtrl, loginCtrl, passwdRecoverPetition, passwdRecoverChange } = require("../controllers/auth")
const authMiddleware = require('../middleware/session.js');
const router = express.Router()

/**
 *  @openapi
 *  /api/auth/register:
 *   post:
 *       tags:
 *       - Auth
 *       summary: "Auth registter"
 *       description: Register a new user
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/registerAuth"
 *       responses:
 *           '200':
 *               description: Registro exitoso. Devuelve el usuario creado y un token.
 *           '409':
 *               description: Error en el registro (validación, duplicado, etc.).
 */

router.post("/register", validatorRegister, registerCtrl)

/**
 *  @openapi
 *  /api/auth/login:
 *   post:
 *       tags:
 *       - Auth
 *       summary: "Auth login"
 *       description: Login a new user
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/login"
 *       responses:
 *           '200':
 *               description: Login exitoso. Devuelve el usuario y un token.
 *           '401':
 *               description: Contraseña inválida.
 *           '404':
 *               description: El usuario no existe.
 *           '409':
 *               description: Error en el proceso de login.
 */
router.post("/login", validatorLogin, loginCtrl)

/**
 *  @openapi
 *  /api/auth/passPetition:
 *   post:
 *       tags:
 *       - Auth
 *       summary: "Auth passPetition"
 *       description: petition for password change
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Petición de recuperación de contraseña enviada correctamente.
 *           '409':
 *               description: Error en la petición de recuperación de contraseña.
 *       security:
 *           - bearerAuth: []
 */
router.post("/passPetition", authMiddleware, passwdRecoverPetition)

/**
 *  @openapi
 *  /api/auth/passChange:
 *   post:
 *       tags:
 *       - Auth
 *       summary: "Auth passChange"
 *       description: password change via code a new password
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                      $ref: "#/components/schemas/passChange"
 *       responses:
 *           '200':
 *               description: Cambio de contraseña exitoso.
 *           '401':
 *               description: Error en el cambio de contraseña (código incorrecto, validación, etc.).
 *       security:
 *           - bearerAuth: []
 */
router.post("/passChange", authMiddleware, validatorNewPasswd, passwdRecoverChange)

module.exports = router