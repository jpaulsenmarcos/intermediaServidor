const projectModel = require('../models/project.js')
const clientModel = require('../models/client.js')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError.js')

const createProject = async (req, res) => {
    try {
        console.log("Hola")
        const body = matchedData(req)
        console.log(body)
        const data = await projectModel.create(body);
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_CREATE_CLIENT')
    }
}

const updateProject = async (req, res) => {
    try {
        const { id } = req.params
        const data = matchedData(req);
        const project = await projectModel.findById(id)
        if (!project) {
            return handleHttpError(res, 'ERROR_PROJECT_NOT_FOUND')
        }
        const client = await clientModel.findById(project.clientId)
        if (String(client.createdBy) !== String(req.user._id)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_PROJECT')
        }
        const updatedProject = await projectModel.findByIdAndUpdate(id, data, { new: true })
        if (!updateProject) {
            return handleHttpError(res, 'ERROR_COULD_NOT_CREATE')
        }
        res.send({ updatedProject })
        res.status(200)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_UPDATE_PROJECT')
    }
}

const getAllYourProjects = async (req, res) => {

    try {
        const userId = req.user._id
        const clients = await clientModel.find({ createdBy: userId });
        if (!clients.length) {
            return handleHttpError(res, 'ERROR_NO_CLIENTS')
        }
        const clientIds = clients.map(client => client._id)
        const projects = await projectModel.find({ clientId: { $in: clientIds } })
        if (!projects.length) {
            return handleHttpError(res, 'ERROR_NO_PROJECTS')
        }
        res.send({ projects })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_YOUR_PROJECTS')
    }
}

const getProjectsFromClient = async (req, res) => {

    try {
        const userId = req.user._id
        const { id } = req.params
        if (!id) {
            return handleHttpError(res, 'ERROR_NO_ID_ESPECIFIED')
        }
        const cliente = await clientModel.findOne({ _id: id })
        console.log("cliente: ", cliente)
        if (String(cliente.createdBy) !== String(userId)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        const projects = await projectModel.find({ clientId: id })
        if (!projects.length) {
            return handleHttpError(res, 'ERROR_NO_PROJECTS')
        }
        res.send({ projects })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_YOUR_PROJECTS_FROM_CLIENT')
    }

}

const getOneProject = async (req, res) => {

    try {
        const userId = req.user._id
        const { clientParam, projectParam } = req.params

        if (!clientParam && !projectParam) {
            return handleHttpError(res, 'ERROR_INSUFICIENT_PARAMS')
        }
        const cliente = await clientModel.findOne({ _id: clientParam })
        if (String(cliente.createdBy) !== String(userId)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        const project = await projectModel.findOne({ _id: projectParam, clientId: cliente._id })
        if (!project) {
            return handleHttpError(res, 'ERROR_NO_PROJECTS')
        }
        res.send({ project })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_YOUR_PROJECT')
    }

}

const archivarProyecto = async (req, res) => {
    try {
        const userId = req.user._id
        const { clientParam, projectParam } = req.params
        const cliente = await clientModel.findOne({ _id: clientParam })
        if (String(cliente.createdBy) !== String(userId)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        const filtro = { _id: projectParam, clientId: clientParam }
        const archivoProyecto = await projectModel.findOneAndUpdate(filtro, { $set: { archivado: true } }, { new: true })
        if (!archivoProyecto) {
            return handleHttpError(res, 'ERROR_PROJECT_INEXISTENT')
        }
        res.send({ message: "archivado!" })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_ARCHIVAR_PROYECTO')
    }
}

const deleteProject = async (req, res) => {
    try {
        const userId = req.user._id
        const { clientParam, projectParam } = req.params
        const cliente = await clientModel.findOne({ _id: clientParam })
        if (String(cliente.createdBy) !== String(userId)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        const filtro = { _id: projectParam, clientId: clientParam }
        const proyectoBorrado = await projectModel.findOneAndDelete(filtro)
        if (!proyectoBorrado) {
            return handleHttpError(res, 'ERROR_PROJECT_INEXISTENT')
        }
        res.send({ message: "eliminado!" })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_BORRAR_PROYECTO')
    }
}

const getArchivedProjects = async (req, res) => {
    try {
        const userId = req.user._id
        const clients = await clientModel.find({ createdBy: userId });
        if (!clients.length) {
            return handleHttpError(res, 'ERROR_NO_CLIENTS')
        }
        const clientIds = clients.map(client => client._id)
        const projects = await projectModel.find({ clientId: { $in: clientIds }, archivado: true })
        if (!projects.length) {
            return handleHttpError(res, 'ERROR_NO_PROJECTS')
        }
        res.send({ projects })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ARVCHIVED_PROJECTS')
    }
}

module.exports = { createProject, updateProject, getAllYourProjects, getProjectsFromClient, getOneProject, archivarProyecto, deleteProject, getArchivedProjects }