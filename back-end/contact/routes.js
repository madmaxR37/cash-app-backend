const router = require('express').Router();

const verifyToken = require("../user/auth-middleware");

const ContactController = require('./controller');

router.post('/contact/add/:id/:contactId', verifyToken, ContactController.add_contact);

router.get('/contacts/:id', verifyToken, ContactController.get_contacts);


module.exports = router;