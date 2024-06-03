const router = require('express').Router();

const verifyToken = require("../user/auth-middleware");

const ContactController = require('./controller');

router.post('/contact/add/:contactId', verifyToken, ContactController.add_contact);

router.get('/contacts', verifyToken, ContactController.get_contacts);


module.exports = router;