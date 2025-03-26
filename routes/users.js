const express = require('express')
const { createUser, onBoardingUser } = require('../controllers/users.js')
const { validatorCreateItem, validatorOnBoardingUser } = require("../validators/users")


const userRouter = express.Router();

userRouter.post('/', validatorCreateItem, createUser);
userRouter.put('/register', validatorOnBoardingUser, onBoardingUser)

module.exports = userRouter;