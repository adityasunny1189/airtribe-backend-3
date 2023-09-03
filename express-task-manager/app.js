const express = require('express');
const bodyParser = require('body-parser');
const taskRouter = require('./router/task-router');

const app = express();

function logger(req, res, next) {
    console.log("Request received at: ", req.method, req.url, " from ", req.ip);
    next();
}

app.use(bodyParser.json());
app.use(logger);

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.use('/tasks', taskRouter);

app.listen(PORT, (err) => {
    console.log(`Server up and running at port ${PORT}`);
})
