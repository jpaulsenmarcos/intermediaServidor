const mongoose = require('mongoose')

const userModel = new mongoose.Schema(
    {
        mail: {
            type: String,
            unique: true
        },
        passwd: String,
        verifyCode: String,
        estado: {
            type: String,
            enum: ["pendiente", "validado", "rechazado"],
            default: "pendiente"
        },
        name: String,
        nif: {
            type: String,
            unique: true
        },
        surnames: String,
        company: {
            name: String,
            cif: String,
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        logo: {
            name: String,
            url: String
        }
    },
    {
        timestamps: true,
        verionKey: false
    }
)

module.exports = mongoose.model('user', userModel)