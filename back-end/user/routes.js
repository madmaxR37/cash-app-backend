const express = require('express');

const router = express.Router();

const verifyToken = require('./auth-middleware');
const userController = require('./controller');

router.post('/user/create', userController.user_create);

router.post('/user/login', userController.user_login);

router.delete('user/delete/:id', userController.user_delete);

router.put('/user/update/:id', verifyToken ,userController.user_update);

module.exports = router;