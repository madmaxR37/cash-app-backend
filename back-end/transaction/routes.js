const express = require('express');

const router = express.Router();

const verifyToken = require('../user/auth-middleware');

const transactionController = require('./controller');

router.post('/transaction/create/:id',/* verifyToken,*/ transactionController.create_transaction);

router.put('/transaction/confirm/:id', transactionController.confirm_transaction);


module.exports = router;