const express = require('express')
const { createClient, getClientsFromUser, getOneClientFromUserById, updateClient } = require('../controllers/client.js')
const { validatorCreateClient } = require('../validators/client.js')
const authMiddleware = require('../middleware/session.js')

const clientRouter = express.Router();

clientRouter.post('/', authMiddleware, validatorCreateClient, createClient);
clientRouter.get('/', authMiddleware, getClientsFromUser);
clientRouter.get('/:id', authMiddleware, getOneClientFromUserById);
clientRouter.put('/', authMiddleware, validatorCreateClient, updateClient);

module.exports = clientRouter