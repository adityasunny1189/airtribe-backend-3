const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodeCron = require('node-cron');
const v1Router = require('./routers/v1/userRouter');
const v1Controller = require('./controllers/v1/userController');
const Logger = require('./middlewares/logger');

const CRON_JOB_STRING = '*/30 * * * *';

mongoose.connect("mongodb://localhost:27017/userdb", {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then((data) => {
    console.log("connected to db");
}).catch(err => {
    console.log("Error connecting to DB: ", err);
})

nodeCron.schedule(CRON_JOB_STRING, () => {
    console.log("News getting updated");
    v1Controller.AutoUpdateNews();
});

const app = express();

app.use(bodyParser.json());
app.use(Logger);

app.use('/api/v1', v1Router);

module.exports = app;
