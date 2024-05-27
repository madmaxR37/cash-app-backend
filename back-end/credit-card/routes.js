const router = require('express').Router();

const verifyToken = require("../user/auth-middleware");

const CreditCardController = require('./controller');

router.post('/creditcard/add/:id', verifyToken, CreditCardController.add_creditcard);

router.get('/creditcards/:id', verifyToken, CreditCardController.get_creditcards);

module.exports = router;