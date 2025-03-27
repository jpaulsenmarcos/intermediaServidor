const userModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const getUsers = async (req, res) => {
    try {
        const user = req.user
        const data = await userModel.find({})
        res.send({ data, user })
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ITEMS', 403)
    }
}

const getUserMine = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await userModel.findOne(userId)
        res.send({ data })
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ITEMS', 403)
    }
}

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

const onBoardingCompany = async (req, res) => {
    try {
        console.log("OnBOARDINGCompany")
        const body = matchedData(req)
        const userId = req.user._id
        const { company } = body
        const user = await userModel.findOneAndUpdate(
            userId,
            { company },
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



module.exports = { createUser, onBoardingUser, onBoardingCompany, getUsers, getUserMine }