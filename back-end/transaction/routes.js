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

router.put('/transaction/confirm/:id', verifyToken, transactionController.confirm_transaction);

router.post('/flw-webhook', transactionController.web_hook);

router.get('/transactions', verifyToken, transactionController.get_all_user_transactions);

router.get('/transactions/filter', verifyToken, transactionController.get_all_transactions_filter)

module.exports = router;