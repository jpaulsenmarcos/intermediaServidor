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
 *       - User
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
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */

verifyRouter.post("/", authMiddleware, validatorCode, verificationCtrl);

module.exports = verifyRouter