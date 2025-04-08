const express = require('express')
const { createClient } = require('../controllers/client.js')
const { validatorCreateClient } = require('../validators/client.js')
const authMiddleware = require('../middleware/session.js')

const clientRouter = express.Router();

clientRouter.post('/', authMiddleware, validatorCreateClient, createClient);

module.exports = clientRouter