const express = require('express')
const { createUser, onBoardingUser, getUsers, getUserMine, onBoardingCompany, deleteUser, inviteUser } = require('../controllers/users.js')
const { validatorCreateItem, validatorOnBoardingUser, validatorOnBoardingCompany, validatorGuest } = require("../validators/users");
const authMiddleware = require('../middleware/session.js');


const userRouter = express.Router();

userRouter.get('/', authMiddleware, getUsers);
userRouter.get('/mine', authMiddleware, getUserMine);
userRouter.delete('/', authMiddleware, deleteUser);
userRouter.post('/', validatorCreateItem, createUser);
userRouter.put('/register', validatorOnBoardingUser, onBoardingUser)
userRouter.patch('/company', authMiddleware, validatorOnBoardingCompany, onBoardingCompany)
userRouter.post('/guest', authMiddleware, validatorGuest, inviteUser);

module.exports = userRouter;