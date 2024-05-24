const router = require('express').Router();

const ContactController = require('./controller');

router.post('/contact/add/:id/:contactId', ContactController.add_contact);

router.get('/contacts/:id', ContactController.get_contacts);


module.exports = router;