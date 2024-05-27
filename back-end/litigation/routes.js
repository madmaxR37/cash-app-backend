const router = require('express').Router();
const LitigationController = require('./controller');
const verifyToken = require("../user/auth-middleware");



router.post('/litigation/create/:id', verifyToken, LitigationController.createLitigation);


module.exports = router;