/**
 * @swagger
 * componenets:
 *  schemas:
 *   ContactModel:
 *    type: object
 *    properties:
 *      name:
 *        type: string 
 *      email:
 *        type: string
 *      phone:
 *        type: string
 *      profile:
 *        type: string 
 *      id: 
 *        type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Contacts:
 *        type: object
 *        properties:
 *          contacts:
 *           type: array
 *           item:
 *              $ref: '#/components/schemas/Contact'
 *       
 */

const router = require('express').Router();

const verifyToken = require("../user/auth-middleware");

const ContactController = require('./controller');

/**
 * @swagger
 *  tags: 
 *   name: Contact
 *   description: Contact managing api
 * 
 * /api/contact/add/:contactId:
 *    post:
 *     security:
 *        - BearerAuth: []
 *     summary: add contact
 *     tags: [Contact]
 *     parameters:
 *        - in: path
 *          name: contactId
 *          schema: 
 *            type: string 
 *            format: ObjectId
 *          required: true
 *          description: object id of the user/contact
 *    responses:
 *         '201':
 *          description: The successful creation message.
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/creationMessage' 
 * 
 */
router.post('/contact/add/:contactId', verifyToken, ContactController.add_contact);
/**
 * @swagger
 *  tags: 
 *   name: Contact
 *   description: Contact managing api get contacts
 * 
 * /api/contacts:
 *    get:
 *     security:
 *        - BearerAuth: []
 *     summary: add contact
 *     tags: [Contact]
 *    responses:
 *         '200':
 *          description: Available contacts.
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Contacts' 
 *         '404':
 *          
 */
router.get('/contacts', verifyToken, ContactController.get_contacts);


module.exports = router;