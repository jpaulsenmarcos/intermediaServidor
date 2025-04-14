const deliveryModel = require('../models/deliverynote.js')
const projectModel = require('../models/project.js')
const clientModel = require('../models/client.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const createProject = async (req, res) => {
    try {
        console.log("Hola")
        const body = matchedData(req)
        console.log(body)
        const data = await deliveryModel.create(body);
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_CREATE_CLIENT')
    }
}

const getDeliverynotes = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const proyecto = await projectModel.findById(id)
        const cliente = await clientModel.findById(proyecto.clientId)
        if (String(cliente.createdBy) !== String(userId)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        if (!proyecto) {
            return handleHttpError(res, 'ERROR_NO_PROYECTS')
        }
        const deliverynotes = await deliveryModel.find({ projectId: id })
        if (!deliverynotes.length) {
            return handleHttpError(res, 'ERROR_NO_DELIVERYNOTES')
        }
        res.send({ deliverynotes })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_DELIVERYNOTES')
    }
}

const getDeliveryNoteById = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const deliverynote = await deliveryModel.findById(id).populate('clientId').populate('projectId');
        if (!deliverynote) {
            return handleHttpError(res, 'ERROR_NO_DELIVERYNOTE')
        }
        const cliente = await clientModel.findById(deliverynote.clientId)
        if (String(cliente.createdBy) !== String(userId)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        res.send({ deliverynote })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_DELIVERYNOTE_BY_ID')
    }
}
module.exports = { createProject, getDeliverynotes, getDeliveryNoteById }