const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { getConnection, runQueryValues, loginSyntax } = require('../model/dbPool');
const { Customer } = require('../model/customer');
//const { User } = require('../model/user')
const secret = process.env.JWT_SECRET || "defaultSecret";

const login = async (req, res) => {
    const { email, userpassword } = req.body;
    try {
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(404).json({ message: 'email not found. Do you want to create an account?' });
        }
        //Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(userpassword, customer.password);
        if (passwordMatch) {
            const role = User.role;
            const token = jwt.sign({ email: customer.email, role }, secret);
            return res.status(200).json({ message: 'Login successful', token });
        }
        else {
            return res.status(401).json({ message: 'Wrong password' });
        }
    } catch (error) {
        console.log('Login error: ', error);
        return res.status(500).json({ message: 'An error occurred during login' });
    }
}

//Initialize an empty set to store invalidated tokens
const tokenBlacklist = new Set();

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        tokenBlacklist.add(token);
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log('Error while loging out');
        return res.status(500).json({ message: 'An error occurred during logout' });
    }
}

module.exports = { login, logout };