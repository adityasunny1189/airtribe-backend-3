const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const v1Router = require('./routers/v1/userRouter');
const Logger = require('./middlewares/logger');

mongoose.connect("mongodb://localhost:27017/usersdb", {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then((data) => {
    console.log("connected to db");
}).catch(err => {
    console.log("Error connecting to DB: ", err);
})

const app = express();

app.use(bodyParser.json());
app.use(Logger);

app.use('/api/v1', v1Router);

module.exports = app;
