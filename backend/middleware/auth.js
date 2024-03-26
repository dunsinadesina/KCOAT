const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "defaultSecret";
const { Customer } = require('../model/customer');
const isAdmin = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' })
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const user = await Customer.findOne({ where: { username: decoded.username } });
        if (user && user.role === 'admin') {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized: Admin access required' })
        }
    } catch (err) {
        console.log('Error in isAdmin middleware: ', err);
        res.status(500).json({ message: 'Unauthorized: Invalid token' })
    }
};

// Maintain a blacklist of invalidated tokens
let blacklist = [];

// Middleware to check if the token is valid
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization.split(' ')[1];
//     if (!token || blacklist.includes(token)) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     try {
//         // Verify the token and extract user information if valid
//         const decoded = jwt.verify(token, secret);
//         req.user = decoded;
//         // next();
//     } catch (error) {
//         return res.status(403).json({ message: 'Forbidden' });
//     }
//     next();
// };
const logout = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    blacklist.push(token);
    res.status(200).json({ message: 'Logout successful' });
}

const isCustomer = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const user = await Customer.findOne({ where: { username: decoded.username } });
        if (user && user.role === 'customer') {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized: Customer access required' })
        }
    } catch (err) {
        console.log('Error in isCustomer middleware: ', err);
        res.status(500).json({ message: 'Unauthorized: Invalid token' })
    }
};

//Export the verifyAuth middleware function
module.exports = { isAdmin, isCustomer,logout };