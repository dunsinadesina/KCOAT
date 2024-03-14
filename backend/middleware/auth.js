const jwt = require("jsonwebtoken");
const verifyAuth = (req, res, next) => {
    const bearer = req.headers["authorization"];
    if (typeof bearer == "undefined") {
        res.status(403).json({ message: "unauthorized user" });
    } else {
        try {
            const fullbearer = bearer.split(" ");
            req.webToken = fullbearer[1];
            req.decoded = jwt.verify(fullbearer[1], "Tech4Dev");
            console.log(req.decoded);
            next();
        } catch (err) {
            res.status(403).json({ message: "invalid token" });
        }
    }
    console.log(bearer);
};

module.exports = { verifyAuth };