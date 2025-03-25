const express = require("express")
const { verificationCtrl } = require('../controllers/verify.js')
const { validatorCode } = require('../validators/code.js')

const verifyRouter = express.Router()

verifyRouter.post("/", validatorCode, verificationCtrl);

module.exports = verifyRouter