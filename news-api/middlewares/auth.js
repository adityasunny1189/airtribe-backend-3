const jwt  = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization, process.env.SECRET_KEY, (err, decode) => {
          if (err)  {
            req.user = undefined;
            next();
          }
          User.findOne({
              _id: decode.id
            }).then(user => {
              req.user = user;
              next();
            }).catch(err => {
              res.status(500)
              .send({
                message: err
              });
            });
        });
    } else {
        req.user = undefined;
        req.message = "Authorization header not found";
        next();
    }
}

module.exports = verifyToken;
