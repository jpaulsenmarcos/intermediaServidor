const express = require('express')
const { createProject, updateProject, getAllYourProjects, getProjectsFromClient, getOneProject, archivarProyecto, deleteProject, getArchivedProjects, recoverProject } = require('../controllers/project.js')
const { validatorCreateProject, validatorUpdateProject } = require('../validators/project.js')
const authMiddleware = require('../middleware/session.js')

const projectRouter = express.Router();

/**
 *  @openapi
 *  /api/project:
 *   post:
 *       tags:
 *       - Project
 *       summary: "Create project"
 *       description: Create a new project for your client
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/createProject"
 *       responses:
 *           '200':
 *               description: DEvuelve el proyecto creado exitosamente.
 *           '409':
 *               description: Error al crear el proyecto.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.post('/', authMiddleware, validatorCreateProject, createProject)
/**
 *  @openapi
 *  /api/project:
 *   get:
 *       tags:
 *       - Project
 *       summary: "User getProjects"
 *       description: get all projects from user
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Devuelve la lista de proyectos del usuario autenticado.
 *           '409':
 *               description: No hay clientes o proyectos asociados.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.get('/', authMiddleware, getAllYourProjects)
/**
 *  @openapi
 *  /api/project/archived:
 *   get:
 *       tags:
 *       - Project
 *       summary: "User get archived projects"
 *       description: get all archived projects from user
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Devuelve la lista de proyectos archivados.
 *           '409':
 *               description: No hay proyectos archivados o error al obtenerlos.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.get('/archived', authMiddleware, getArchivedProjects)
/**
 *  @openapi
 *  /api/project/:id:
 *   put:
 *       tags:
 *       - Project
 *       summary: "Update one project"
 *       description: update one project by indicating the id
 *       parameters:
 *         - in: path
 *           name: id
 *           description: Identificador único del proyecto
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/updateProject"
 *       responses:
 *           '200':
 *               description: Devuelve el proyecto actualizado correctamente.
 *           '404':
 *               description: Proyecto no encontrado.
 *           '409':
 *               description: El proyecto no pertenece al usuario o error al actualizar.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.put('/:id', authMiddleware, validatorUpdateProject, updateProject)
/**
 *  @openapi
 *  /api/project/client/:id:
 *   get:
 *       tags:
 *       - Project
 *       summary: "User get projects from client"
 *       description: get all projects from a client
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
 *               description: Devuelve los proyectos del cliente obtenidos correctamente.
 *           '409':
 *               description: Cliente no válido, sin proyectos o no autorizado.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.get('/client/:id', authMiddleware, getProjectsFromClient)
/**
 *  @openapi
 *  /api/project/:clientParam/:projectParam:
 *   get:
 *       tags:
 *       - Project
 *       summary: "User get one project from client"
 *       description: get one specific projects from a client
 *       parameters:
 *         - in: path
 *           name: clientParam
 *           description: Identificador único del cliente
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *         - in: path
 *           name: projectParam
 *           description: Identificador único del proyecto
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
 *               description: Devuelve un proyecto específico obtenido correctamente.
 *           '409':
 *               description: Proyecto no encontrado o cliente no válido.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.get('/:clientParam/:projectParam', authMiddleware, getOneProject)
/**
 *  @openapi
 *  /api/project/archivar/:clientParam/:projectParam:
 *   put:
 *       tags:
 *       - Project
 *       summary: "User archivate project"
 *       description: archivate one project from a client (soft-delete)
 *       parameters:
 *         - in: path
 *           name: clientParam
 *           description: Identificador único del cliente
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *         - in: path
 *           name: projectParam
 *           description: Identificador único del proyecto
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
 *               description: Proyecto archivado correctamente.
 *           '409':
 *               description: Proyecto inexistente o cliente no autorizado.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.put('/archivar/:clientParam/:projectParam', authMiddleware, archivarProyecto)
/**
 *  @openapi
 *  /api/project/recuperar/:clientParam/:projectParam:
 *   put:
 *       tags:
 *       - Project
 *       summary: "User recover project"
 *       description: recover one project from a client
 *       parameters:
 *         - in: path
 *           name: clientParam
 *           description: Identificador único del cliente
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *         - in: path
 *           name: projectParam
 *           description: Identificador único del proyecto
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
 *               description: Proyecto restaurado correctamente.
 *           '409':
 *               description: Proyecto inexistente o cliente no autorizado.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.put('/recuperar/:clientParam/:projectParam', authMiddleware, recoverProject)
/**
 *  @openapi
 *  /api/project/:clientParam/:projectParam:
 *   delete:
 *       tags:
 *       - Project
 *       summary: "User delete project"
 *       description: delete one project from a client (hard-delete)
 *       parameters:
 *         - in: path
 *           name: clientParam
 *           description: Identificador único del cliente
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *         - in: path
 *           name: projectParam
 *           description: Identificador único del proyecto
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
 *               description: Proyecto eliminado permanentemente.
 *           '409':
 *               description: Proyecto inexistente o cliente no autorizado.
 *       security:
 *           - bearerAuth: []
 */
projectRouter.delete('/:clientParam/:projectParam', authMiddleware, deleteProject)

module.exports = projectRouter