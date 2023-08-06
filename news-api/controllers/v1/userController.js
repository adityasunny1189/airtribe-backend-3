const getNews = require('../../helpers/utils/news');

const BASE_URL = 'https://newsapi.org/v2/top-headlines';

const RegisterUser = (req, res) => {
    res.send('Register User');
}

const LoginUser = (req, res) => {
    res.send('Login User');
}

const GetUserPreferences = (req, res) => {
    res.send('User Preferences');
}

const UpdateUserPreferences = (req, res) => {
    res.send('Update User Preferences');
}

const GetNews = async (req, res) => {
    const country = req?.country || 'in';
    const category = req?.category || 'general';
    const url = `${BASE_URL}?country=${country}&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
    const news = await getNews(url);
    try {
        res.status(200).send(news);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetUserPreferences,
    UpdateUserPreferences,
    GetNews
}
