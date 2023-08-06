const express = require('express');
const bodyParser = require('body-parser');
const router = require('express').Router();

const app = express();

app.use(bodyParser.json());
app.use(router);

router.get('/', (req, res) => {
    res.send('Hello world');
});

module.exports = app;
