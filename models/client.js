const mongoose = require('mongoose')

const clientModel = new mongoose.Schema(
    {
        name: String,
        cif: {
            type: String,
            unique: true,
        },
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        archivado: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        verionKey: false
    }
)

module.exports = mongoose.model('client', clientModel)