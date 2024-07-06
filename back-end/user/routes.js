/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *     -first_name
 *     -last_name
 *     -date_of_birth
 *     -address.city
 *     -address.quarter
 *     -address.country
 *     -email
 *     -phone_number
 *     -password
 *     -pin
 *    properties:
 *     id:
 *      type: string
 *     first_name:
 *      type: string
 *     last_name:
 *      type: string
 *     date_of_bitrh:
 *      type: string
 *      format: date
 *     address.city:
 *      type: string
 *     address.quater:
 *      type: string
 *     address.country:
 *      type:string
 *     pin:
 *      type: string
 *     wallet.name:
 *      type: string
 *     wallet.account_balance:
 *      type: number
 *      format: float
 *     wallet.curency:
 *      type: string
 *     role:
 *      type: string
 *     profile:
 *      type: string
 *     created:
 *      type: string
 *      format: date 
 *    example:
 *      id: 664efcd272cfcc7b319f9531
 *      first_name: Maximilien
 *      last_name: Tamko
 *      date_of_birth: 2003-09-20T04:05:06.157Z
 *      address.city: Douala
 *      address.quarter: Yassa
 *      address.country: Cameroon
 *      email: maxtamko74@gmail.com
 *      phone_number: 654454353
 *      password: #mypassword123$
 *      pin: 020394 
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   creationMessage: 
 *    type: object
 *    properties:
 *     message:
 *      type:string
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   errorsMessages:
 *    type: object
 *    properties:
 *     messages:
 *      type: array
 *      items:
 *       type: string
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   login: 
 *    type: object
 *    properties:
 *     message:
 *      type:string
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   successfulLogin:
 *    type: object
 *   properties:
 *    credentials:
 *     type:string
 *    password:
 *     type:string
 */


const express = require("express");

const router = express.Router();

const verifyToken = require("./auth-middleware");

const userController = require("./controller");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 * /api/user/create:
 *   post:
 *     summary: saves a user in the database
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *              first_name: Maximilien
 *              last_name: Tamko
 *              date_of_birth: 2003-09-20T04:05:06.157Z
 *              address.city: Douala
 *              address.quarter: Yassa
 *              address.country: Cameroon
 *              email: maxtamko74@gmail.com
 *              phone_number: '654454353'
 *              password: '#mypassword123$'
 *              pin: '020394' 
 *     responses:
 *      '201':
 *       description: The successful creation message.
 *       content: 
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/creationMessage'
 *            
 *      '400':
 *       description: Validation errors
 *       content:
 *          application/jason:
 *            schema:
 *              $ref: '#/components/schemas/errorsMessages'
 *      '500':
 *       description: Some error.
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 * /api/user/login:
 *    post:
 *      summary: login
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/login'
 *            example:
 *               credentials: test@xmail.com
 *               password: admin283$
 *      responses:
 *        '200':
 *         description: The successful login token.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successfulLogin'
 *             example:
 *                message: successful login
 *        '401':
 *         description: wrong credentials error
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorsMessages' 
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 * /api/user/:
 *    get:
 *      security:
 *        - BearerAuth: []
 *      summary: getting user info
 *      tags: [User]
 *      responses:
 *        '200':
 *         description: User's information
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *    
 */

router.post("/user/create", userController.user_create);

router.post("/user/login", userController.user_login);

router.post("/refresh", userController.refresh_token);

router.put("/user/update/password", userController.user_update_password);

router.delete("/user/delete", verifyToken, userController.user_delete);

router.get("/user", verifyToken, userController.get_user_by_id);

router.get("/user/find", verifyToken, userController.get_user_by_email);


router.put("/user/update", verifyToken, userController.user_update);

module.exports = router;
