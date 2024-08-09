const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send("Please authenticate using a valid token");

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = payload.id; 
        next();
    } catch (err) {
        res.status(401).send("Please authenticate using a valid token");
    }
};

module.exports = fetchUser;
