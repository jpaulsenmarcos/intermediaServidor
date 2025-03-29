const express = require("express")
const { validatorRegister, validatorLogin, validatorNewPasswd } = require("../validators/auth")
const { validatorCode } = require('../validators/code')
const { registerCtrl, loginCtrl, passwdRecoverPetition, passwdRecoverChange } = require("../controllers/auth")
const authMiddleware = require('../middleware/session.js');
const router = express.Router()

router.post("/register", validatorRegister, registerCtrl)
router.post("/login", validatorLogin, loginCtrl)
router.post("/passPetition", authMiddleware, passwdRecoverPetition)
router.post("/passChange", authMiddleware, validatorNewPasswd, passwdRecoverChange)

module.exports = router