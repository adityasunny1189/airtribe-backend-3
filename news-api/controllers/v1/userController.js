const getNews = require('../../helpers/utils/news');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        email: email
    }).then(user => {
        if(!user) {
            res.status(404).send({
                message: "user not found"
            });
        }

        let isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid) {
            res.status().send({
                accessToken: null,
                message: "Password Incorrect"
            });
        }

        let token = jwt.sign({
            id: user.id
        }, process.env.SECRET_KEY, {
            expiresIn: 84000
        });

        res.status(200).send({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            },
            message: "Login Sucessful",
            accessToken: token
        });
    }).catch(err => {
        if(err) {
            res.status(500).send({
                message: err
            });
        }
    })
}

const GetUserPreferences = (req, res) => {
    if(req.user) {
        res.status(200).send({
            preferences: req.user.preferences
        });
    } else {
        if(req.message) {
            res.status(401).send(res.message)
        } else {
            res.status(500).send({
                message: "invalid token"
            })
        }
    }
}

const UpdateUserPreferences = (req, res) => {
    let preferences = req.body.preferences;
    console.log("user: ", req.user, " prefer: ", preferences);
    if(req.user && preferences) {
        User.findOneAndUpdate({
            _id: req.user.id
        }, {
            preferences: preferences
        }).then(user => {
            if(!user) {
                res.status(404).send({
                    message: "user not found"
                })
            }
            res.status(200).send({
                message: "user preferences updated"
            })
        }).catch(err => {
            res.status(500).send({
                message: err
            })
        })
    } else {
        if(req.message) {
            res.status(401).send(res.message)
        } else {
            res.status(500).send({
                message: "invalid token"
            })
        }
    }
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
