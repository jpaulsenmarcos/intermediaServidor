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
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
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
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
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
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
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
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
router.post("/passChange", authMiddleware, validatorNewPasswd, passwdRecoverChange)

module.exports = router