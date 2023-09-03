const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    }
    console.log(`Server up and running at port ${PORT}`);
});
