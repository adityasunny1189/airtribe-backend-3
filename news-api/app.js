const express = require('express');
const bodyParser = require('body-parser');
const v1Router = require('./routers/v1/userRouter');
const Logger = require('./middlewares/logger');

const app = express();

app.use(bodyParser.json());
app.use(Logger);

app.use('/api/v1', v1Router);

module.exports = app;
