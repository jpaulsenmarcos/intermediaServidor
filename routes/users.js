const express = require('express')
const { createUser, onBoardingUser, getUsers, getUserMine, onBoardingCompany, deleteUser, inviteUser } = require('../controllers/users.js')
const { validatorCreateItem, validatorOnBoardingUser, validatorOnBoardingCompany, validatorGuest } = require("../validators/users");
const authMiddleware = require('../middleware/session.js');


const userRouter = express.Router();

/**
 *  @openapi
 *  /api/users:
 *   post:
 *       tags:
 *       - User
 *       summary: "User getUsers"
 *       description: get all users
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
userRouter.get('/', authMiddleware, getUsers);

/**
 *  @openapi
 *  /api/users/mine:
 *   post:
 *       tags:
 *       - User
 *       summary: "User getUserMine"
 *       description: get only your user info via token
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
userRouter.get('/mine', authMiddleware, getUserMine);

/**
 *  @openapi
 *  /api/users:
 *   delete:
 *       tags:
 *       - User
 *       summary: "User deleteUser"
 *       description: deletes your user depending of which type of delete you specify (?soft=true-soft, ?soft=false-hard)
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
userRouter.delete('/', authMiddleware, deleteUser);
userRouter.post('/', validatorCreateItem, createUser);

/**
 *  @openapi
 *  /api/users/register:
 *   put:
 *       tags:
 *       - User
 *       summary: "User onBoardingUser"
 *       description: allows you to insert more personal information about the user
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                      $ref: "#/components/schemas/resgiterUser"
 *                      
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
userRouter.put('/', authMiddleware, validatorOnBoardingUser, onBoardingUser)

/**
 *  @openapi
 *  /api/users/company:
 *   patch:
 *       tags:
 *       - User
 *       summary: "User onBoardingcompany"
 *       description: allows you to insert information about his own company
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                      $ref: "#/components/schemas/onBoardingCompany"
 *                      
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */
userRouter.patch('/company', authMiddleware, validatorOnBoardingCompany, onBoardingCompany)

/**
 *  @openapi
 *  /api/users/guest:
 *   post:
 *       tags:
 *       - User
 *       summary: "User inviteUser"
 *       description: allows you to invite a new user a guest role (the data company is the same as the user's)
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                      $ref: "#/components/schemas/inviteUser"
 *                      
 *       responses:
 *           '200':
 *               description: Returns the inserted object
 *           '401':
 *               description: Validation error
 *       security:
 *           - bearerAuth: []
 */

userRouter.post('/guest', authMiddleware, validatorGuest, inviteUser);

module.exports = userRouter;