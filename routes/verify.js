const express = require("express")
const { verificationCtrl } = require('../controllers/verify.js')
const { validatorCode } = require('../validators/code.js')
const authMiddleware = require('../middleware/session.js');

const verifyRouter = express.Router()

verifyRouter.post("/", authMiddleware, validatorCode, verificationCtrl);

module.exports = verifyRouter