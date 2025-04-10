const projectModel = require('../models/project.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const createProject = async (req, res) => {
    try {
        console.log("Hola")
        const body = matchedData(req)
        console.log(body)
        const data = await projectModel.create(body);
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_CREATE_CLIENT')
    }
}

module.exports = { createProject }