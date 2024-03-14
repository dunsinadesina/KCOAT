//Import necessary modules
const bcrypt = require('bcryptjs');
//Set the number of salts rounds for bcrypt
const bcSaltRounds = bcrypt.genSaltSync(10);
const { getConnection, runQueryValues, signupSyntax } = require('../model/dbPool');
//Define the signup function
async function signup(req, res) {
    //Extract credentials from the request body
    const credentials = {
        username: req.body.username,
        userpassword: bcrypt.hashSync(req.body.userpassword, bcSaltRounds) //encrypt password
    }
    //Get database connection
    const connection = await getConnection();
    try {
        //Run a query to create a new user with the provided credentials
        const result = await runQueryValues(connection, signupSyntax, [credentials.username, credentials.userpassword])
        console.log(result);
        res.status(200).json({ message: "An error occurred while signing up" });
    }
    catch (err) {
        console.log(err)
    }
}
//Export the signup function
module.exports = { signup };