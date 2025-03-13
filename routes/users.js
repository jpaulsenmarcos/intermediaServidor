const express = require('express')
const { createUser } = require('../controllers/users.js')
const { validatorCreateItem } = require("../validators/users")


const userRouter = express.Router();

userRouter.post('/', validatorCreateItem, createUser);

module.exports = userRouter;