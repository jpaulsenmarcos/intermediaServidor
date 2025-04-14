const express = require('express')
const { createProject, getDeliverynotes, getDeliveryNoteById } = require('../controllers/deliverynote.js')
const { validatorCreateDeliverynote } = require('../validators/deliverynote.js')
const authMiddleware = require('../middleware/session.js')

const deliveryRouter = express.Router();

deliveryRouter.post('/', authMiddleware, validatorCreateDeliverynote, createProject)
deliveryRouter.get('/:id', authMiddleware, getDeliverynotes)
deliveryRouter.get('/ById/:id', authMiddleware, getDeliveryNoteById)

module.exports = deliveryRouter