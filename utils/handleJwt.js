require('dotenv').config();
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

console.log(JWT_SECRET)

const tokenSign = (user) => {
    const sign = jwt.sign({
        _id: user._id,
        role: user.role
    },
        JWT_SECRET,
        {
            expiresIn: "2h"
        }
    )
    return sign
}

const verifyToken = (tokenJwt) => {
    try {
        console.log("VERIFY: ", jwt.verify(tokenJwt, JWT_SECRET))
        return jwt.verify(tokenJwt, JWT_SECRET)
    } catch (error) {
        console.log(err)
    }
}

module.exports = { tokenSign, verifyToken }