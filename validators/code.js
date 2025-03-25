const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorCode = [
    check("verifyCode").notEmpty().isNumeric().isLength({ min: 6, max: 6 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = { validatorCode }