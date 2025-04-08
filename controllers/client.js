const clientModel = require('../models/client')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const createClient = async (req, res) => {
    try {
        console.log("Hola")
        const body = matchedData(req)
        console.log(body)
        body.createdBy = req.user._id;
        const data = await clientModel.create(body);
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_CREATE_CLIENT')
    }
}

module.exports = { createClient }