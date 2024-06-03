const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes= require('./user/routes');
const  transactionRoutes= require('./transaction/routes');
const notificationRoutes = require('./notification/routes');
const litigationRoutes = require('./litigation/routes')
const contactRoutes = require('./contact/routes');
const creditCardRoutes = require('./credit-card/routes');
const db_connection = require('./utils/db_connection');
const swaggerJsdoc= require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = require('./utils/swagger.options');

const specs = swaggerJsdoc(options);

const app = express();
app.use(express.json());
db_connection;
app.use(cors());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(specs));
app.use('/api', userRoutes, transactionRoutes, notificationRoutes, litigationRoutes, contactRoutes,creditCardRoutes);
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({err:'un expected error'});
  });

module.exports = app;
