const express = require('express');
const cors = require('cors');
const userRoutes= require('./user/routes');
const  transactionRoutes= require('./transaction/routes');
const notificationRoutes = require('./notification/routes');
const litigationRoutes = require('./litigation/routes')
const contactRoutes = require('./contact/routes');
const db_connection = require('./utils/db_connection');

const app = express();
app.use(express.json());
db_connection;
app.use(cors());
app.use('/api', userRoutes, transactionRoutes, notificationRoutes, litigationRoutes, contactRoutes);
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({err});
  });

module.exports = app;
