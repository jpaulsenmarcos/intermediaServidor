const express = require('express')
const { createProject } = require('../controllers/deliverynote.js')
const { validatorCreateDeliverynote } = require('../validators/deliverynote.js')
const authMiddleware = require('../middleware/session.js')

const deliveryRouter = express.Router();

deliveryRouter.post('/', authMiddleware, validatorCreateDeliverynote, createProject)

module.exports = deliveryRouter