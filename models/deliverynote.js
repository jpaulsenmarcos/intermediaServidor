const mongoose = require('mongoose')

const deliveryModel = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'client'
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'project'
        },
        format: {
            type: String,
            enum: ["material", "hours"]
        },
        hours: Number,
        description: String,
        workdate: Date,
    }
)

module.exports = mongoose.model('deliverynote', deliveryModel)