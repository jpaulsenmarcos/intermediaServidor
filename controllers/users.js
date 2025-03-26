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

const onBoardingUser = async (req, res) => {
    try {
        console.log("OnBOARDING")
        const body = matchedData(req)
        const { mail, name, surnames, nif } = body
        const user = await userModel.findOneAndUpdate(
            { mail: mail },
            { name, surnames, nif },
            { new: true }
        );
        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }
        user.set("passwd", undefined, { strict: false })

        res.send({ user })
    } catch (err) {
        handleHttpError(res, 'ERROR_ONBOARD_USER')
    }
}

module.exports = { createUser, onBoardingUser }