const express = require('express');
const userRouter = express.Router();
const userController = require('../../controllers/v1/userController');
const verifyToken = require('../../middlewares/auth');

userRouter.post('/register', userController.RegisterUser);
userRouter.post('/login', userController.LoginUser);
userRouter.get('/preferences', verifyToken, userController.GetUserPreferences);
userRouter.put('/preferences', verifyToken, userController.UpdateUserPreferences);
userRouter.get('/news', verifyToken, userController.GetNews);

module.exports = userRouter;
