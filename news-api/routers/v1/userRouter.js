const express = require('express');
const userRouter = express.Router();
const userController = require('../../controllers/v1/userController');

userRouter.post('/register', userController.RegisterUser);
userRouter.post('/login', userController.LoginUser);
userRouter.get('/preferences', userController.GetUserPreferences);
userRouter.put('/preferences', userController.UpdateUserPreferences);
userRouter.get('/news', userController.GetNews);

module.exports = userRouter;
