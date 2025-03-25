const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorRegister = [

    check("mail").notEmpty().isEmail(),
    check("passwd").notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorLogin = [
    check("mail").notEmpty().isEmail(),
    check("passwd").notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]
module.exports = { validatorRegister, validatorLogin }