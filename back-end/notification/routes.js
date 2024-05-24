const router = require('express').Router();
const NotificationController = require('./controller');

router.get('/notifications/:id', NotificationController.getUserNotifications);


module.exports = router;