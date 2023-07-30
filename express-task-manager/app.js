const express = require('express');
const bodyParser = require('body-parser');
const taskRouter = require('./router/task-router');

const app = express();

app.use(bodyParser.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.use('/tasks', taskRouter);

app.listen(PORT, (err) => {
    console.log(`Server up and running at port ${PORT}`);
})
