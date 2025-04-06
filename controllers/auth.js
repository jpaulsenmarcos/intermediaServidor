const usersModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')
const { encrypt, compare } = require("../utils/handlePassword")
const { tokenSign } = require("../utils/handleJwt.js")

const { sendVerifyCode } = require("../utils/handleEmail.js")

const { verifyUserCode } = require('../controllers/verify.js')

function generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const registerCtrl = async (req, res) => {
    req = matchedData(req)
    const passwd = await encrypt(req.passwd)
    const verifyCode = generarCodigo();
    const body = { ...req, passwd, verifyCode, estado: "pendiente", numberOfTries: 3 } // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
    const dataUser = await usersModel.create(body)

    await sendVerifyCode(dataUser);

    dataUser.set('passwd', undefined, { strict: false })
    dataUser.set('verifyCode', undefined, { strict: false })

    const data = {
        token: await tokenSign(dataUser),
        user: dataUser
    }
    console.log(data.token)
    res.send(data)
}

const loginCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const user = await usersModel.findOne({ mail: req.mail })
        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }
        //const hashPassword = await encrypt(user.passwd);
        const check = await compare(req.passwd, user.passwd)
        if (!check) {
            handleHttpError(res, "INVALID_PASSWORD", 401)
            return
        }
        user.set("passwd", undefined, { strict: false })
        const data = {
            token: await tokenSign(user),
            user
        }
        res.send(data)
    } catch (err) {
        handleHttpError(res, "ERROR_LOGIN_PROCESS")
    }
}

const passwdRecoverPetition = async (req, res) => {
    //esto envía de nuevo un código de verificación

    try {
        const userId = req.user._id
        const user = await usersModel.findById(userId)

        const verifyCode = generarCodigo();

        user.estado = "pendiente"
        user.verifyCode = verifyCode
        await user.save()
        res.send({ success: true });
    } catch (err) {
        handleHttpError(res, "ERROR_RECOVER_PETITION")
    }
}

const passwdRecoverChange = async (req, res) => {
    try {
        const body = matchedData(req);
        const user = await usersModel.findById(req.user._id);

        console.log("Código almacenado:", user.verifyCode)
        await verifyUserCode(user, body.verifyCode);

        const newPasswd = await encrypt(body.newPasswd);
        user.passwd = newPasswd;
        await user.save();

        return res.send({ success: true });
    } catch (err) {
        console.error("Error en passwdRecoverChange:", err);
        handleHttpError(res, 'ERROR_RECOVERCHANGE')
    }
}

module.exports = { registerCtrl, loginCtrl, passwdRecoverPetition, passwdRecoverChange }