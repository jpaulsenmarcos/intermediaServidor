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
 *       security:
 *           - bearerAuth: []
 */

router.post("/register", validatorRegister, registerCtrl)
router.post("/login", validatorLogin, loginCtrl)
router.post("/passPetition", authMiddleware, passwdRecoverPetition)
router.post("/passChange", authMiddleware, validatorNewPasswd, passwdRecoverChange)

module.exports = router