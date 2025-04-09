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

const archivarCliente = async (req, res) => {
    try {
        const data = matchedData(req);
        if (!data.cif) {
            return res.status(400).json({ error: 'FALTA CIF EN LA PETICIÓN' });
        }
        const filtro = { cif: data.cif, createdBy: req.user._id }

        const archivoCliente = await clientModel.findOneAndUpdate(filtro, { $set: { archivado: true } }, { new: true })
        if (!archivoCliente) {
            return handleHttpError(res, 'ERROR_CLIENT_INEXISTENT')
        }
        res.send({ message: "archivado!" })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_SOFT_CLIENT')
    }
}

const deleteClient = async (req, res) => {
    try {
        const data = matchedData(req);
        if (!data.cif) {
            return res.status(400).json({ error: 'FALTA CIF EN LA PETICIÓN' });
        }
        const filtro = { cif: data.cif, createdBy: req.user._id }
        const clienteBorrado = await clientModel.findOneAndDelete(filtro)
        if (!clienteBorrado) {
            return handleHttpError(res, 'ERROR_CLIENT_INEXISTENT')
        }
        res.send({ message: "eliminado!" })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_DELETE_CLIENT')
    }
}

const getArchivedClients = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await clientModel.find({ createdBy: userId, archivado: true });
        if (!data.length) {
            return handleHttpError(res, 'ERROR_NO_ARCHIVED_CLIENTS')
        }
        res.send({ data })
        res.status(200)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_GET_ARCHIVED_CLIENTS')
    }
}

const restoreClient = async (req, res) => {
    try {
        const data = matchedData(req);
        if (!data.cif) {
            return res.status(400).json({ error: 'FALTA CIF EN LA PETICIÓN' });
        }
        const filtro = { cif: data.cif, createdBy: req.user._id }

        const clienteEncontrado = await clientModel.findOne(filtro)

        if (clienteEncontrado.archivado === false) {
            return handleHttpError(res, 'ERROR_CLIENT_NOT_ARCHIVED')
        }

        const archivoCliente = await clientModel.findOneAndUpdate(filtro, { $set: { archivado: false } }, { new: true })
        if (!archivoCliente) {
            return handleHttpError(res, 'ERROR_CLIENT_INEXISTENT')
        }
        res.send({ message: "restaurado!" })
        res.status(200)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_RESTORE_CLIENT')
    }
}

module.exports = { createClient, getClientsFromUser, getOneClientFromUserById, updateClient, archivarCliente, deleteClient, getArchivedClients, restoreClient }