const mongoose = require('mongoose')

const projectModel = new mongoose.Schema(
    {
        name: String,
        email: String,
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        code: String,
        clientId: String,
        notes: String,
        archivado: {
            type: Boolean,
            default: false
        }
    }
)

module.exports = mongoose.model('project', projectModel)