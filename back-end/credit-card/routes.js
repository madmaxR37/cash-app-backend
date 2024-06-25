/**
 * @swagger 
 *  components:
 *   schemas:
 *     CreditCard:
 *      require:
 *       -name
 *       -number
 *       -cvv
 *       -expdate
 *      properties:
 *       name:
 *        type: string
 *       number:
 *        type: string
 *       cvv:
 *         type: string
 *       expdate:
 *         type: string
 *       brand: 
 *         type: string
 * 
 */
/**
 * @swagger
 * components:
 *  schemas:
 *   CreditCardList:
 *    properties:
 *          type: array
 *          notifications:
 *               $ref: '#/components/schemas/CreditCard'
 * 
 */
const router = require('express').Router();

const verifyToken = require("../user/auth-middleware");

const CreditCardController = require('./controller');
/**
 * @swagger 
 *  tags:
 *   name: CreditCard
 *   description: CreditCards managing api
 * /api/creditcard/add:
 *   post:
 *     security:
 *        - BearerAuth: []
 *     summary: create a litigation
 *     tags: [CreditCard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/CreditCard'
 *   responses:
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
 */

router.post('/creditcard/add', verifyToken, CreditCardController.add_creditcard);

/**
 * @swagger
 * tags:
 *   name: CreditCard
 *   description: The Notification managing API
 * /api/creditcards:
 *   get:
 *      security:
 *        - BearerAuth: []
 *      tags: [CreditCard]
 *   responses:
 *      '200': 
 *       description: sends back a list of notifications.
 *       content:
 *          application/json:
 *           schemas: 
 *             $ref: '#/components/schemas/CreditCardList'
 *      '404':
 *       description: sent when no notification is present.
 */

router.get('/creditcards', verifyToken, CreditCardController.get_creditcards);

module.exports = router;