const bcrypt = require('bcryptjs')
const bcSaltRounds = bcrypt.genSaltSync(10);
const { getConnection, runQueryValues, loginSyntax, updateLogin, emailLogin } = require('../model/dbPool')


const resetPassword = async (req, res) => {

    const credentials = {
        // username: req.body.username,
        email: req.body.email,
        userpassword: bcrypt.hashSync(req.body.userpassword, bcSaltRounds)
    }
    const connection = await getConnection();
    try {
        const result1 = await runQueryValues(connection, emailLogin, [credentials.email])
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

module.exports = { resetPassword }