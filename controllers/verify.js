const userModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

async function verifyUserCode(user, code) {
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    if (user.estado !== "validado" && user.verifyCode === code) {
        user.estado = "validado";
        user.verifyCode = "000000";
        await user.save();
    } else if (user.estado === "validado") {
        throw new Error("ALREADY_VALIDATED");
    } else {
        user.estado = "rechazado";
        await user.save();
        throw new Error("ERROR_WRONG_CODE");
    }
}

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

module.exports = { verificationCtrl, verifyUserCode }