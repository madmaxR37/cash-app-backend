const router = require('express').Router();
const NotificationController = require('./controller');
const verifyToken = require("../user/auth-middleware");

router.get('/notifications/:id', verifyToken, NotificationController.getUserNotifications);


module.exports = router;