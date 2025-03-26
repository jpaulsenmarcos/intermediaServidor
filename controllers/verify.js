const userModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const verificationCtrl = async (req, res) => {

    try {
        const body = matchedData(req)
        const userId = req.user._id
        const user = await userModel.findById(userId)

        if (!user) {
            return handleHttpError(res, 'ERROR_NO_MAIL_COINCIDENCE')
        }
        if (user.estado !== "validado" && user.verifyCode === body.verifyCode) {
            user.estado = "validado"
            user.verifyCode = "000000"
            await user.save()
        } if (user.estado === "validado") {
            console.log("Está validado")
        }
        else {
            console.log("Introduzco: ", body.verifyCode)
            console.log("Original: ", user.verifyCode)
            user.estado = "rechazado"
            await user.save()
            return handleHttpError(res, 'ERROR_WRONG_CODE')
        }
    } catch (err) {
        console.error("Error en verificationCtrl:", err);
        return handleHttpError(res, 'ERROR_VERIFICATION')
    }
}

module.exports = { verificationCtrl }