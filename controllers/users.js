const userModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const createUser = async (req, res) => {
    try {
        console.log("Hola")
        const body = matchedData(req)
        console.log(body)
        const data = await userModel.create(req.body);
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_CREATE_ITEMS')
    }
}

module.exports = { createUser }