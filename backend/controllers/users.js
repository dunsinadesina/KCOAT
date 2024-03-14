//Import necessary modules
const bcrypt = require('bcryptjs');
//Set the number of salt rounds for bcrypt
const bcSaltRounds = bcrypt.genSaltSync(10);
const { getConnection, runQueryValues, signupSyntax } = require('../model/dbPool')
async function signup(req, res) {
    const credentials = {
        username: req.body.username,
        email: req.body.email,
        userpassword: bcrypt.hashSync(req.body.userpassword, bcSaltRounds)
    }
    const connection = await getConnection();
    try {
        const result = await runQueryValues(connection, signupSyntax, [credentials.username, credentials.userpassword, credentials.email])
        res.status(200).json({ message: result });
    }
    catch (err) {
        console.log(err)
    }
}
module.exports = { signup }