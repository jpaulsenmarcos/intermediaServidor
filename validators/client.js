const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateClient = [
    check("name").notEmpty().withMessage("FALTA NOMBRE"),
    check("cif").notEmpty().withMessage("FALTA CIF"),
    check("address").notEmpty().withMessage("FALTA ADDRESS"),
    check("address.street").notEmpty().withMessage("FALTA STREET"),
    check("address.number").notEmpty().withMessage("FALTA NUMBER"),
    check("address.postal").notEmpty().withMessage("FALTA POSTAL"),
    check("address.city").notEmpty().withMessage("FALTA CITY"),
    check("address.province").notEmpty().withMessage("FALTA PROVINCE"),
    validateResults
]

module.exports = { validatorCreateClient }