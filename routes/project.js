const express = require('express')
const { createProject, updateProject, getAllYourProjects, getProjectsFromClient, getOneProject } = require('../controllers/project.js')
const { validatorCreateProject, validatorUpdateProject } = require('../validators/project.js')
const authMiddleware = require('../middleware/session.js')

const projectRouter = express.Router();

projectRouter.post('/', authMiddleware, validatorCreateProject, createProject)
projectRouter.get('/', authMiddleware, getAllYourProjects)
projectRouter.put('/:id', authMiddleware, validatorUpdateProject, updateProject)
projectRouter.get('/client/:id', authMiddleware, getProjectsFromClient)
projectRouter.get('/:clientParam/:projectParam', authMiddleware, getOneProject)

module.exports = projectRouter