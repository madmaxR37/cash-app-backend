const express = require('express');
const cors = require('cors');
const userRoutes= require('./user/routes');
const db_connection = require('./utils/db_connection');

const app = express();
app.use(express.json());
db_connection;
app.use(cors())
app.use('/api', userRoutes);
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });

module.exports = app;