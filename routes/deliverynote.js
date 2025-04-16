const express = require('express')
const { createProject, getDeliverynotes, getDeliveryNoteById, downloadPdf, signDeliverynote, downloadSignedPdf } = require('../controllers/deliverynote.js')
const { uploadMiddlewareMemory } = require('../utils/handleStorage.js')
const { validatorCreateDeliverynote } = require('../validators/deliverynote.js')
const authMiddleware = require('../middleware/session.js')

const deliveryRouter = express.Router();

deliveryRouter.post('/', authMiddleware, validatorCreateDeliverynote, createProject)
deliveryRouter.get('/:id', authMiddleware, getDeliverynotes)
deliveryRouter.get('/ById/:id', authMiddleware, getDeliveryNoteById)
deliveryRouter.get('/pdf/:id', authMiddleware, downloadPdf)
deliveryRouter.get('/signimage/:id', authMiddleware, signDeliverynote)
deliveryRouter.patch("/signimage/:id", authMiddleware, uploadMiddlewareMemory.single("image"), (err, req, res, next) => {
    console.log("ERROR:::::::: ", err.code)
    res.status(413).send("Error capturado")
}, signDeliverynote)
deliveryRouter.patch('/signedPdf/:id', authMiddleware, downloadSignedPdf)

module.exports = deliveryRouter