const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateItem = [
    check("mail").notEmpty(),
    check("passwd").notEmpty().withMessage("FALTA CONTRASEÑA"),
    validateResults
]

const validatorOnBoardingUser = [
    check("mail").notEmpty(),
    check("name").notEmpty().withMessage("FALTA NOMBRE"),
    check("surnames").notEmpty().withMessage("FALTAN APELLIDOS"),
    check("nif").notEmpty().withMessage("FALTA NIF"),
    validateResults
]


module.exports = { validatorCreateItem, validatorOnBoardingUser }