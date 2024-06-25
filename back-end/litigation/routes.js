/**
 * @swagger
 * components:
 *  schemas:
 *   Litigation:
 *    type: object
 *    require:
 *     -title
 *     -description
 *    properties:
 *      title:
 *       type: string
 *      description:
 *        type: string
 */

const router = require('express').Router();
const LitigationController = require('./controller');
const verifyToken = require("../user/auth-middleware");

/**
 * @swagger
 *   tags:
 *   name: Litigation
 *   description: The Litigation managing API
 * /api/litigation/create:
 *    post:
 *     security:
 *        - BearerAuth: []
 *     summary: create a litigation
 *     tags: [Litigation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *               $ref: '#/components/schemas/Litigation'
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

router.post('/litigation/create', verifyToken, LitigationController.createLitigation);


module.exports = router;