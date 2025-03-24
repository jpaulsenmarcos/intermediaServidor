const express = require("express")
const { validatorRegister } = require("../validators/auth")
const { registerCtrl } = require("../controllers/auth")
const router = express.Router()

router.post("/register", validatorRegister, registerCtrl)

module.exports = router