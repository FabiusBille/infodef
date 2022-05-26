const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("Неверные данные для входа");
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        console.log(err)
        return res.status(401).send("Неверные данные для входа");
    }
    return next();
};

module.exports = verifyToken;