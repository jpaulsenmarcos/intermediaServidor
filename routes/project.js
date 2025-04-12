const express = require('express')
const { createProject, updateProject, getAllYourProjects, getProjectsFromClient, getOneProject, archivarProyecto, deleteProject, getArchivedProjects } = require('../controllers/project.js')
const { validatorCreateProject, validatorUpdateProject } = require('../validators/project.js')
const authMiddleware = require('../middleware/session.js')

const projectRouter = express.Router();

projectRouter.post('/', authMiddleware, validatorCreateProject, createProject)
projectRouter.get('/', authMiddleware, getAllYourProjects)
projectRouter.get('/archived', authMiddleware, getArchivedProjects)
projectRouter.put('/:id', authMiddleware, validatorUpdateProject, updateProject)
projectRouter.get('/client/:id', authMiddleware, getProjectsFromClient)
projectRouter.get('/:clientParam/:projectParam', authMiddleware, getOneProject)
projectRouter.put('/archivar/:clientParam/:projectParam', authMiddleware, archivarProyecto)
projectRouter.delete('/:clientParam/:projectParam', authMiddleware, deleteProject)

module.exports = projectRouter