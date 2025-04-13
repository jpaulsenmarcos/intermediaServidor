const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorCreateDeliverynote = [
    check("clientId").notEmpty().withMessage("FALTA CLIENTID"),
    check("projectId").notEmpty().withMessage("FALTA PROJECTID"),
    check("format").notEmpty().withMessage("FALTA FORMAT"),
    check("material").notEmpty().withMessage("FALTA MATERIAL"),
    check("hours").notEmpty().withMessage("FALTA HOURS"),
    check("description").notEmpty().withMessage("FALTA DESCRIPTION"),
    check("workdate").notEmpty().withMessage("FALTA WORKDATE"),
    validateResults
]

module.exports = { validatorCreateDeliverynote }