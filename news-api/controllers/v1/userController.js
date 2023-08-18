const getNews = require('../../helpers/utils/news');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient();

const connectRedisClient = async () => {
    await redisClient.connect();
}

connectRedisClient();

const DEFAULT_EXPIRY_TIME = 3600;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';
const SEARCH_BASE_URL = 'https://newsapi.org/v2/everything';

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
    if(req.user) {
        const country = req?.country || 'in';
        const category = req?.category || 'general';
        const url = `${BASE_URL}?country=${country}&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
        redisClient.get('news').then(async data => {
            if(data) {
                res.status(200).send(JSON.parse(data));
            } else {
                try {
                    let news = await getNews(url);
                    redisClient.setEx('news', DEFAULT_EXPIRY_TIME, JSON.stringify(news));
                    res.status(200).send(news);
                } catch (err) {
                    res.status(500).send(err);
                }
            }
        }).catch(err => {
            console.log(err);
        })
    } else {
        if(req.message) {
            res.status(401).send({
                message: req.message
            })
        } else {
            res.status(500).send({
                message: "invalid token"
            })
        }
    }
}

const AutoUpdateNews = async () => {
    try {
        let news = await getNews(url);
        redisClient.setEx('news', DEFAULT_EXPIRY_TIME, JSON.stringify(news));
    } catch (err) {
        console.log("Error while calling news api: ", err);
    }
}

// NOTE: Or use this without async await, here the value returned is a promise while when we use async await then the resolved or rejected value is directly returned

// const GetNewsPromise = (req, res) => {
//     if(req.user) {
//         const country = req?.country || 'in';
//         const category = req?.category || 'general';
//         const url = `${BASE_URL}?country=${country}&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
//         let news =  getNews(url);
//         news.then(data => {
//             res.status(200).send(news);
//         }).catch(err => {
//             res.status(500).send(err);
//         })
//     } else {
//         if(req.message) {
//             res.status(401).send({
//                 message: req.message
//             })
//         } else {
//             res.status(500).send({
//                 message: "invalid token"
//             })
//         }
//     }
// }

const SearchNews = async (req, res) => {
    let keyword = req.params.keyword;
    if(req.user) {
        const url = `${SEARCH_BASE_URL}?q=${keyword}&apiKey=${process.env.NEWS_API_KEY}`;
        redisClient.get(keyword).then(async data => {
            if(data) {
                res.status(200).send(JSON.parse(data));
            } else {
                try {
                    let news = await getNews(url);
                    redisClient.setEx(keyword, DEFAULT_EXPIRY_TIME, JSON.stringify(news));
                    res.status(200).send(news);
                } catch (error) {
                    res.status(500).send({
                        message: error
                    });
                }
            }
        }).catch(err => {
            console.log(err);
        })
    } else {
        if(req.message) {
            res.status(401).send({
                message: req.message
            })
        } else {
            res.status(500).send({
                message: "invalid token"
            })
        }
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetUserPreferences,
    UpdateUserPreferences,
    GetNews,
    SearchNews,
    AutoUpdateNews
}
