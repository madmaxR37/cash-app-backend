const router = require('express').Router();

const verifyToken = require("../user/auth-middleware");

const CreditCardController = require('./controller');

router.post('/creditcard/add', verifyToken, CreditCardController.add_creditcard);

router.get('/creditcards', verifyToken, CreditCardController.get_creditcards);

module.exports = router;