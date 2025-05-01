const express = require("express")
const { verificationCtrl } = require('../controllers/verify.js')
const { validatorCode } = require('../validators/code.js')
const authMiddleware = require('../middleware/session.js');

const verifyRouter = express.Router()

/**
 *  @openapi
 *  /api/verify:
 *   post:
 *       tags:
 *       - Verify
 *       summary: "User verificationCtrl"
 *       description: function to verify your mail via code
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                      $ref: "#/components/schemas/verificationCtrl"
 *                      
 *       responses:
 *           '200':
 *               description: Verificación exitosa. Devuelve un mensaje de confirmación.
 *           '401':
 *               description: No coincide el email/token del usuario (usuario no encontrado).
 *           '422':
 *               description: Código de verificación incorrecto. El usuario aún tiene intentos restantes.
 *           '429':
 *               description: No hay más intentos disponibles para verificar el código.
 *           '409':
 *               description: Error general durante el proceso de verificación.
 *       security:
 *           - bearerAuth: []
 */

verifyRouter.post("/", authMiddleware, validatorCode, verificationCtrl);

module.exports = verifyRouter