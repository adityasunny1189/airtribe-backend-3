const Logger = (req, res, next) => {
    console.log("Request received at: ", req.method, req.url, " from ", req.ip);
    next();
}

module.exports = Logger;
