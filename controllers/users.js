const userModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')
const { encrypt, compare } = require("../utils/handlePassword")
const { tokenSign } = require("../utils/handleJwt.js")

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
        const { mail, name, surnames, nif, autonomo } = body

        const updateData = { name, surnames, nif };
        if (autonomo !== undefined) {
            updateData.autonomo = autonomo;
        }

        const user = await userModel.findOneAndUpdate(
            { mail: mail },
            updateData,
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

const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id
        const { soft } = req.query
        if (soft === undefined) {
            handleHttpError(res, 'ERROR_SOFT_PARAM_UNDIFINED')
        }
        const user = await userModel.findById(userId)
        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }
        if (soft === "true") {
            user.deleted = true
            await user.save()
            console.log('Usuario borrado SOFT')
        } else if (soft === "false") {
            await userModel.findByIdAndDelete(userId)
            console.log('Usuario borrado HARD')
        } else {
            handleHttpError(res, 'INVALID_SOFT_PARAM')
            return
        }

    } catch (err) {
        handleHttpError(res, 'ERROR_DELETE_USER')
    }
}

const inviteUser = async (req, res) => {
    try {
        const userId = req.user._id
        const body = matchedData(req)
        const invitante = req.user
        if (!invitante) {
            handleHttpError(res, 'NO_HAY_INVITANTE')
            return
        }
        if (!invitante.company) {
            handleHttpError(res, 'INVITANTE_NO_TIENE_COMPANY')
            return
        }

        const password = await encrypt(body.passwd)

        const dataInvitado = {
            ...body,
            passwd: password,
            role: 'guest',
            createdBy: userId,
            company: invitante.company
        }
        const invitado = await userModel.create(dataInvitado)
        invitado.set("passwd", undefined, { strict: false })
        res.send({ data: invitado })
    } catch (err) {
        handleHttpError(res, 'ERROR_INVITE_USER')
    }
}


module.exports = { createUser, onBoardingUser, onBoardingCompany, getUsers, getUserMine, deleteUser, inviteUser }