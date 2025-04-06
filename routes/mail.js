const express = require("express")
const { validatorMail } = require("../validators/mail")
const { send } = require("../controllers/mail")
const router = express.Router()
const authMidlleware = require("../middleware/session.js")

router.post("/", authMidlleware, validatorMail, send)

module.exports = router