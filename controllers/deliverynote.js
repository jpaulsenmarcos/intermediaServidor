const deliveryModel = require('../models/deliverynote.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const createProject = async (req, res) => {
    try {
        console.log("Hola")
        const body = matchedData(req)
        console.log(body)
        const data = await deliveryModel.create(body);
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_CREATE_CLIENT')
    }
}

module.exports = { createProject }