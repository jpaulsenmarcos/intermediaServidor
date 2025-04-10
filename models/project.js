const mongoose = require('mongoose')

const projectModel = new mongoose.Schema(
    {
        name: String,
        projectCode: {
            type: String,
            unique: true
        },
        email: String,
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        code: String,
        clientId: String
    }
)

module.exports = mongoose.model('project', projectModel)