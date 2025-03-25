const mongoose = require('mongoose')

const userModel = new mongoose.Schema(
    {
        mail: {
            type: String,
            unique: true
        },
        passwd: String,
        verifyCode: Number,
        verified: Boolean,
    },
    {
        timestamps: true,
        verionKey: false
    }
)

module.exports = mongoose.model('user', userModel)