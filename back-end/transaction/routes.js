/**
 * @swagger
 * components:
 *   securitySchemes:
 *      BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */  
/**
 * @swagger
 * components:
 *  schemas:
 *    TransactionCreationMessage:
 *      type: string
 */
/**
 * @swagger
 * components:
 *  schemas:
 *    TransactionConfirmation:
 *       type: object
 *       required: 
 *          -pin
 *       properties:
 *          pin:
 *            type: string 
 */
/**
 * @swagger
 * components:
 *  schemas:
 *     Transaction:
 *      type: object
 *      required:
 *        -receiverEmail
 *        -amount
 *      properties:
 *        receiverEmail:
 *         type:string
 *        amount:
 *          type: number
 *          
 */
const express = require('express');

const verifyToken = require("../user/auth-middleware"); 

const router = express.Router();


const transactionController = require('./controller');

/**
 * @swagger
 *  tags:
 *   name: Transaction
 *   description: The Transaction managing API
 * /api/transaction/create:
 *   post:
 *     security:
 *        - BearerAuth: []
 *     summary: initiat transaction
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *               $ref: '#/components/schemas/Transaction'
 *     responses:
 *       '201':
 *        description: The transaction is successfully created.
 *        content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/TransactionCreationMessage'  
 *       '400':
 *         description: Validation errors
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/errorsMessages'
 *   
 *     
 */

router.post('/transaction/create', verifyToken, transactionController.create_transaction);

router.post('/transaction/create/:id', verifyToken, transactionController.create_transaction_with_id);

/**
 * @swagger
 *  tags: 
 *   name: Transaction
 *   description: Transaction managing api
 * 
 * /api/transaction/confirm/{id}:
 *    put:
 *     security:
 *        - BearerAuth: []
 *     summary: confirm transaction
 *     tags: [Transaction]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema: 
 *            type: string 
 *            format: ObjectId
 *          required: true
 *          description: object id of the transaction
 *     requestBody:
 *      required: true 
 *      content: 
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/TransactionConfirmation'
 *     
 *        
 */

/**
 * @swagger
 *  tags:
 *   name: Transaction
 *   description: The Transaction managing API
 * /api/transactions:
 *   get:
 *     security:
 *        - BearerAuth: []
 *     summary: get all transactions
 *     tags: [Transaction]
 *     requestBody:
 *       required: false
 *       
 *     responses: 
 *       '200':
 *         content: 
 *            application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  transactions:
 *                      type: array
 *                      items:
 *                         $ref: '#/components/schemas/Transaction'
 *                        
 *       '400':
 *         
 *       '401':
 *       
 *       '404':
 *       
 *       '500':
 *
 */

/**
 * @swagger
 *  tags:
 *   name: Transaction
 *   description: The Transaction managing API
 * /api/transactions/filter:
 *   get:
 *     security:
 *        - BearerAuth: []
 *     summary: get all transactions
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: string
 *     responses: 
 *       '200':
 *         content: 
 *            application/json:
 *                $ref: '#/components/schemas/Transaction'
 *                 
 *       
 */
router.put('/transaction/confirm/:id', verifyToken, transactionController.confirm_transaction);

router.get('/transactions', verifyToken, transactionController.get_all_user_transactions);

router.get('/transactions/filter/:timeframe', verifyToken, transactionController.get_all_transactions_filter);

router.post('/transaction/mobile-charge', verifyToken, transactionController.mobile_charge);

router.post('/transaction/carte-charge', verifyToken, transactionController.carte_charge);

router.post('/transaction/mobile-withdraw', verifyToken, transactionController.mobile_withdraw);

module.exports = router;