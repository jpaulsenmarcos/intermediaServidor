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
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
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
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
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
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
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
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/updateProject"
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
projectRouter.put('/:id', authMiddleware, validatorUpdateProject, updateProject)
projectRouter.get('/client/:id', authMiddleware, getProjectsFromClient)
projectRouter.get('/:clientParam/:projectParam', authMiddleware, getOneProject)
projectRouter.put('/archivar/:clientParam/:projectParam', authMiddleware, archivarProyecto)
projectRouter.put('/recuperar/:clientParam/:projectParam', authMiddleware, recoverProject)
projectRouter.delete('/:clientParam/:projectParam', authMiddleware, deleteProject)

module.exports = projectRouter