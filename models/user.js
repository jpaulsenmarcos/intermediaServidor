const mongoose = require('mongoose')

const userModel = new mongoose.Schema(
    {
        mail: {
            type: String,
            unique: true
        },
        passwd: String,
        verifyCode: String,
        numberOfTries: Number,
        estado: {
            type: String,
            enum: ["pendiente", "validado", "rechazado"],
            default: "pendiente"
        },
        name: String,
        nif: {
            type: String,
            unique: true,
            sparse: true,
            default: undefined
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
        },
        deleted: Boolean,
        role: {
            type: String,
            enum: ["admin", "guest"],
            default: "admin"
        },
        autonomo: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        verionKey: false
    }
)

module.exports = mongoose.model('user', userModel)