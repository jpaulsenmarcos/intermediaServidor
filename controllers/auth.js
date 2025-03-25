const usersModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')
const { encrypt, compare } = require("../utils/handlePassword")
const { tokenSign } = require("../utils/handleJwt.js")

const registerCtrl = async (req, res) => {
    req = matchedData(req)
    const passwd = await encrypt(req.passwd)
    const body = { ...req, passwd } // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
    const dataUser = await usersModel.create(body)
    dataUser.set('passwd', undefined, { strict: false })
    const data = {
        token: await tokenSign(dataUser),
        user: dataUser
    }
    console.log(data.token)
    res.send(data)
}

module.exports = { registerCtrl }