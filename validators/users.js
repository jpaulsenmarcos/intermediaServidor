const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateItem = [
    check("mail").notEmpty(),
    check("passwd").notEmpty().withMessage("FALTA CONTRASEÑA"),
    validateResults
]

module.exports = { validatorCreateItem }