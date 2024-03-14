const bcrypt = require('bcryptjs');
const bcSaltRounds = bcrypt.genSaltSync(10);
const { getConnection, runQueryValues, signupSyntax } = require('../model/dbPool')
async function signup(req, res) {
    const credentials = {
        username: req.body.username,
        userpassword: bcrypt.hashSync(req.body.userpassword, bcSaltRounds) //encrypt password
    }
    const connection = await getConnection();
    try {
        const result = await runQueryValues(connection, signupSyntax, [credentials.username, credentials.userpassword])
        console.log(result);
        res.status(200).json({ message: result });
    }
    catch (err) {
        console.log(err)
    }
}
module.exports = { signup }