const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { getConnection, runQueryValues, loginSyntax } = require('../model/dbPool')
const secret = process.env.JWT_SECRET || "defaultSecret";

const login = async (req, res) => {
    const { username, userpassword } = req.body;

    try {
        const connection = await getConnection();
        const result = await runQueryValues(connection, loginSyntax, [username]);

        if (result.length == 0) {
            return res.status(404).json({ message: 'Username not found. Do you want to create an account?' });
        }

        const storedPassword = result[0].userpassword;
        const passwordMatch = await bcrypt.compare(userpassword, storedPassword);

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
module.exports = { login };