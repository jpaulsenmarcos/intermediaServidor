const mongoose = require('mongoose')

const deliveryModel = new mongoose.Schema(
    {
        clientId: String,
        projectId: String,
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