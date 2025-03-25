const usersModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')
const { encrypt, compare } = require("../utils/handlePassword")
const { tokenSign } = require("../utils/handleJwt.js")

function generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const registerCtrl = async (req, res) => {
    req = matchedData(req)
    const passwd = await encrypt(req.passwd)
    const verifyCode = generarCodigo();
    const body = { ...req, passwd, verifyCode, estado: "pendiente" } // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
    const dataUser = await usersModel.create(body)
    dataUser.set('passwd', undefined, { strict: false })
    dataUser.set('verifyCode', undefined, { strict: false })

    const data = {
        token: await tokenSign(dataUser),
        user: dataUser
    }
    console.log(data.token)
    res.send(data)
}

module.exports = { registerCtrl }