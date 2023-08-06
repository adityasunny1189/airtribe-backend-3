const getNews = require('../../helpers/utils/news');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

const BASE_URL = 'https://newsapi.org/v2/top-headlines';

const RegisterUser = (req, res) => {
    let user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        preferences: req.body.preferences,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save()
        .then((data) => {
            res.status(201).send({
                message: "User Created",
                data: data
            })
        }).catch((err) => {
            res.status(404).send({
                message: err
            });
        });
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
    try {
        let news = await getNews(url);
        res.status(200).send(news);
    } catch (err) {
        res.status(500).send(err);
    }
}

// or

const GetNewsPromise = (req, res) => {
    const country = req?.country || 'in';
    const category = req?.category || 'general';
    const url = `${BASE_URL}?country=${country}&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
    let news =  getNews(url);
    news.then(data => {
        res.status(200).send(news);
    }).catch(err => {
        res.status(500).send(err);
    })
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetUserPreferences,
    UpdateUserPreferences,
    GetNews
}
