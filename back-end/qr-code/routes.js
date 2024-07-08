const router = require('express').Router();

const verifyToken = require("../user/auth-middleware");

const QRController = require('./controller');

router.get('/qr-code', verifyToken, QRController.get_QR_code_url);

module.exports = router;