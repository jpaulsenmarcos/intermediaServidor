const clientModel = require('../models/client')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const createClient = async (req, res) => {
    try {
        console.log("Hola")
        const body = matchedData(req)
        console.log(body)
        body.createdBy = req.user._id;
        const data = await clientModel.create(body);
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_CREATE_CLIENT')
    }
}

const getClientsFromUser = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await clientModel.find({ createdBy: userId });
        res.send({ data })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_CLIENTS_FROM_USER', 403)
    }
}

const getOneClientFromUserById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id
        const data = await clientModel.findOne({ _id: id, createdBy: userId });
        if (!data) {
            return handleHttpError(res, 'ERROR_NO_CLIENT')
        }
        res.send({ data })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_CLIENTS_FROM_USER', 403)
    }
}

const updateClient = async (req, res) => {
    try {
        const data = matchedData(req);
        if (!data.cif) {
            return res.status(400).json({ error: 'FALTA CIF EN LA PETICIÓN' });
        }
        const filtro = { cif: data.cif, createdBy: req.user._id }
        const clientUpdate = await clientModel.findOneAndUpdate(filtro, data, { new: true })
        if (!clientUpdate) {
            return handleHttpError(res, 'ERROR_CLIENT_INEXISTENT')
        }
        res.send({ clientUpdate })
        res.status(200)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_UPDATE_CLIENTS')
    }
}

module.exports = { createClient, getClientsFromUser, getOneClientFromUserById, updateClient }