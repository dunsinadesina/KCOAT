//Import necessary modules
const bcrypt = require('bcryptjs');
//Set the number of salts rounds for bcrypt
const bcSaltRounds = bcrypt.genSaltSync(10);
const { getConnection, runQueryValues, loginSyntax, updateLogin, emailLogin } = require('../model/dbPool')
//Define the resetPassword function
const resetPassword = async (req, res) => {
//Extract credentials from the request body
    const credentials = {
        // username: req.body.username,
        email: req.body.email,
        userpassword: bcrypt.hashSync(req.body.userpassword, bcSaltRounds)
    }
    //Get a database connection
    const connection = await getConnection();
    try {
        //Run a query to check if the email exists in the database
        const result1 = await runQueryValues(connection, emailLogin, [credentials.email])
        //If email exists, update the password
        if (result1.length > 0) {
            const result = await runQueryValues(connection, updateLogin, [credentials.userpassword, credentials.email])
            res.status(200).json({ message: "Password has been reset", result })
        }
        else {
            res.status(403).json({ message: "Username does not exist. Do you want to create an account?" })
        }
    }
    catch (err) {
        console.log(err)
    }
}
//Export the resetPassword function
module.exports = { resetPassword }