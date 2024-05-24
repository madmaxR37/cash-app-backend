const router = require('express').Router();

const CreditCardController = require('./controller');

router.post('/creditcard/add/:id', CreditCardController.add_creditcard);

router.get('/creditcards/:id', CreditCardController.get_creditcards);

module.exports = router;