const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateProject = [
    check("name").notEmpty().withMessage("FALTA NOMBRE"),
    check("email").notEmpty().withMessage("FALTA EMAIL"),
    check("address").notEmpty().withMessage("FALTA ADDRESS"),
    check("address.street").notEmpty().withMessage("FALTA STREET"),
    check("address.number").notEmpty().withMessage("FALTA NUMBER"),
    check("address.postal").notEmpty().withMessage("FALTA POSTAL"),
    check("address.city").notEmpty().withMessage("FALTA CITY"),
    check("address.province").notEmpty().withMessage("FALTA PROVINCE"),
    check("code").notEmpty().withMessage("FALTA CODE"),
    check("clientId").notEmpty().withMessage("FALTA CLIENT ID"),
    validateResults
]

module.exports = { validatorCreateProject }