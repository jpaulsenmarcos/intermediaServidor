const express = require('express')
const { createClient, getClientsFromUser, getOneClientFromUserById, updateClient, archivarCliente, deleteClient, getArchivedClients, restoreClient } = require('../controllers/client.js')
const { validatorCreateClient, validatorSoftClient } = require('../validators/client.js')
const authMiddleware = require('../middleware/session.js')

const clientRouter = express.Router();

/**
 *  @openapi
 *  /api/client:
 *   post:
 *       tags:
 *       - Client
 *       summary: "Create client"
 *       description: Create a new client for your user
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/createClient"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
clientRouter.post('/', authMiddleware, validatorCreateClient, createClient);
/**
 *  @openapi
 *  /api/client:
 *   get:
 *       tags:
 *       - Client
 *       summary: "User getClients"
 *       description: get all clients from user
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
clientRouter.get('/', authMiddleware, getClientsFromUser);
/**
 *  @openapi
 *  /api/client:
 *   put:
 *       tags:
 *       - Client
 *       summary: "Update client"
 *       description: Update a client of your user that exists
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/updateClient"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
clientRouter.put('/', authMiddleware, validatorCreateClient, updateClient);
/**
 *  @openapi
 *  /api/client/archivar:
 *   delete:
 *       tags:
 *       - Client
 *       summary: "Archivate client"
 *       description: Archivate a client of your user that exists (soft delete)
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/archivarCliente"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
clientRouter.delete('/archivar', authMiddleware, validatorSoftClient, archivarCliente);
/**
 *  @openapi
 *  /api/client/restore:
 *   patch:
 *       tags:
 *       - Client
 *       summary: "Restore client"
 *       description: Restore a client state (undo soft-delete)
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/restoreClient"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
clientRouter.patch('/restore', authMiddleware, validatorSoftClient, restoreClient);
/**
 *  @openapi
 *  /api/client/restore:
 *   delete:
 *       tags:
 *       - Client
 *       summary: "Delete client"
 *       description: Delete a client permanently (hard-delete)
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/deleteClient"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
clientRouter.delete('/delete', authMiddleware, validatorSoftClient, deleteClient);
/**
 *  @openapi
 *  /api/client/archived:
 *   get:
 *       tags:
 *       - Client
 *       summary: "User get archivated clients"
 *       description: get all archived clients from user
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
clientRouter.get('/archived', authMiddleware, getArchivedClients);
/**
 *  @openapi
 *  /api/client/:id:
 *   get:
 *       tags:
 *       - Client
 *       summary: "User get one client"
 *       description: get one client from your user
 *       parameters:
 *         - in: path
 *           name: id
 *           description: Identificador único del cliente
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
clientRouter.get('/:id', authMiddleware, getOneClientFromUserById);

module.exports = clientRouter