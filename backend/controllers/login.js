const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { getConnection, runQueryValues, loginSyntax } = require('../model/dbPool');
const { CustomerAuth, Customer } = require('../model/customer');
const {User} = require('../model/user')
//Get the JWT secret from environment variable
const secret = process.env.JWT_SECRET || "defaultSecret";

//Define the login function
const login = async (req, res) => {
    //Extract username and password from the request body
    const { username, userpassword } = req.body;
    try {
        //retrive customer info from the db
        const customer = await Customer.findOne({ where: { username } });
        if (!customer) {
            return res.status(404).json({ message: 'Username not found. Do you want to create an account?' });
        }
        //Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(userpassword, customer.password);
        //If passwords match, generate a JWT token and return it
        if (passwordMatch) {
            const role = User.role;
            const token = jwt.sign({ username: customer.username, role }, secret);
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
//Export the login function
module.exports = { login };