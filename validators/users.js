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

const validatorOnBoardingCompany = [
    check("company").isObject(),
    check("company.name").notEmpty().withMessage("FALTA NOMBRE"),
    check("company.cif").notEmpty().withMessage("FALTA CIF"),
    check("company.street").notEmpty().withMessage("FALTA STREET"),
    check("company.number").notEmpty().withMessage("FALTA NUMBER"),
    check("company.postal").notEmpty().withMessage("FALTA POSTAL"),
    check("company.city").notEmpty().withMessage("FALTA CITY"),
    check("company.province").notEmpty().withMessage("FALTA PROVINCE"),
    validateResults
]

const validatorGuest = [
    check("mail").notEmpty().withMessage("FALTA MAIL"),
    check("passwd").notEmpty().withMessage("FALTA CONTRASEÑA"),
    check("name").notEmpty().withMessage("FALTA NOMBRE"),
    check("surnames").notEmpty().withMessage("FALTAN APELLIDOS"),
    check("nif").notEmpty().withMessage("FALTA NIF"),
    validateResults
]


module.exports = { validatorCreateItem, validatorOnBoardingUser, validatorOnBoardingCompany, validatorGuest }