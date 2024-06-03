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
 *        -bearerAuth: []
 *     summary: initiat transaction
 *     tags: [transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *               $ref: '#/components/schemas/Transaction'
 *     responses:
 *       '201'
 *   
 *     
 */

router.post('/transaction/create', verifyToken, transactionController.create_transaction);

router.put('/transaction/confirm/:id', verifyToken, transactionController.confirm_transaction);


module.exports = router;