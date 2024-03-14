//Import necessary modules
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { getConnection, runQueryValues, loginSyntax } = require('../model/dbPool')
//Get the JWT secret from environment variable
const secret = process.env.JWT_SECRET || "defaultSecret";

//Define the login function
const login = async (req, res) => {
    //Extract username and password from the request body
    const { username, userpassword } = req.body;
    try {
        //Get database connection
        const connection = await getConnection();
        //Run a query to retrieve the customer's information
        const result = await runQueryValues(connection, loginSyntax, [username]);

        if (result.length == 0) {
            return res.status(404).json({ message: 'Username not found. Do you want to create an account?' });
        }
        //Retrive the stored hashed password from the database
        const storedPassword = result[0].userpassword;
        //Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(userpassword, storedPassword);
        //If passwords match, generate a JWT token and return it
        if (passwordMatch) {
            const token = jwt.sign({ username }, secret);
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