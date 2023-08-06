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

const GetNews = (req, res) => {
    res.send('Get News');
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetUserPreferences,
    UpdateUserPreferences,
    GetNews
}
