const axios = require('axios');

const getNews = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((response) => {
                return resolve(response.data);
            }).catch((err) => {
                return reject(err);
            });
    })
}

module.exports = getNews;
