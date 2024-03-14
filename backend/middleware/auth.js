//Import necessary modules
const jwt = require("jsonwebtoken");
//Define a middleware function to verify authentication
const verifyAuth = (req, res, next) => {
    //Extract the authorization token from the request headers
    const bearer = req.headers["authorization"];
    if (typeof bearer == "undefined") {
        //Check if the authorization token is undefined
        res.status(403).json({ message: "unauthorized user" });
    } else {
        try {
            //Split the authorization token to extract the token value
            const fullbearer = bearer.split(" ");
            //Extract the token value and decode it
            req.webToken = fullbearer[1];
            req.decoded = jwt.verify(fullbearer[1], "Tech4Dev");
            //Log the decoded token and proceed to the next middleware
            console.log(req.decoded);
            next();
        } catch (err) {
            res.status(403).json({ message: "invalid token" });
        }
    }
    console.log(bearer);
};
//Export the verifyAuth middleware function
module.exports = { verifyAuth };