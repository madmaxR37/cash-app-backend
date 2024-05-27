const express = require('express');

const verifyToken = require("../user/auth-middleware");

const router = express.Router();


const transactionController = require('./controller');

router.post('/transaction/create/:id', verifyToken, transactionController.create_transaction);

router.put('/transaction/confirm/:id', verifyToken, transactionController.confirm_transaction);


module.exports = router;