const express = require('express')
const { createProject } = require('../controllers/project.js')
const { validatorCreateProject } = require('../validators/project.js')
const authMiddleware = require('../middleware/session.js')

const projectRouter = express.Router();

projectRouter.post('/', authMiddleware, validatorCreateProject, createProject)

module.exports = projectRouter