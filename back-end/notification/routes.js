/**
 * @swagger
 * components:
 *   schemas:
 *    Notification:
 *     type: object
 *     properties:
 *       userid: 
 *         type: string 
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       creationdate: 
 *         type: string
 *         format: date-time
 *       opened:
 *         type: boolean
 *      
 */
/**
 * @swagger
 * components:
 *  schemas:
 *    NotificationResponse:
 *      type: object
 *      properties:
 *        notifications:
 *          type: array
 *          itmes:
 *            $ref: '#/components/schemas/Notification'
 */
const router = require('express').Router();
const NotificationController = require('./controller');
const verifyToken = require("../user/auth-middleware");

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: The Notification managing API
 * /api/notifications:
 *   get:
 *      security:
 *        - BearerAuth: []
 *      tags: [Notification]
 *   responses:
 *      '200': 
 *       description: sends back a list of notifications.
 *       content:
 *          application/json:
 *           schemas: 
 *             $ref: '#/components/schemas/NotificationResponse'
 *      '404':
 *       description: sent when no notification is present.
 *        
 *        
 */

router.get('/notifications', verifyToken, NotificationController.getUserNotifications);


module.exports = router;