const express = require('express')
const { createClient, getClientsFromUser, getOneClientFromUserById, updateClient, archivarCliente, deleteClient, getArchivedClients, restoreClient } = require('../controllers/client.js')
const { validatorCreateClient, validatorSoftClient } = require('../validators/client.js')
const authMiddleware = require('../middleware/session.js')

const clientRouter = express.Router();

clientRouter.post('/', authMiddleware, validatorCreateClient, createClient);
clientRouter.get('/', authMiddleware, getClientsFromUser);
clientRouter.put('/', authMiddleware, validatorCreateClient, updateClient);
clientRouter.delete('/archivar', authMiddleware, validatorSoftClient, archivarCliente);
clientRouter.delete('/restore', authMiddleware, validatorSoftClient, restoreClient);
clientRouter.delete('/delete', authMiddleware, validatorSoftClient, deleteClient);
clientRouter.get('/archived', authMiddleware, getArchivedClients);
clientRouter.get('/:id', authMiddleware, getOneClientFromUserById);

module.exports = clientRouter