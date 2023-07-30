const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.listen(PORT, (err) => {
    console.log(`Server up and running at port ${PORT}`);
})
