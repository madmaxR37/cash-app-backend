const router = require('express').Router();
const LitigationController = require('./controller')
router.post('/litigation/create/:id', LitigationController.createLitigation);


module.exports = router;