import bcrypt from 'bcryptjs';
import { getConnection, runQueryValues } from '../model/dbPool.js';

export const resetPassword = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const connection = await getConnection();
        //Run a query to check if the email exists in the database
        const result1 = await runQueryValues(connection, emailLogin, [email])
        //If email exists, update the password
        if (result1.length > 0) {
            //genenate salt rounds each time before hashing
            bcrypt.genSalt(10, (error, salt) => {
                if (error) {
                    console.log('Error generating salt: ', error);
                    return res.status(500).json({ message: 'An error occurred while resetting password' })
                }
                //hash the password with generated salt
                bcrypt.hash(password, salt, async (error, hashedPassword) => {
                    if (error) {
                        console.log('Error hashing the password: ', error);
                        return res.status(500).json({ message: 'An error occurred while resetting password' });
                    }
                    //update the password in the database
                    const result = await runQueryValues(connection, updateLogin, [hashedPassword, email]);
                    res.status(200).json({ message: "The password was successfully updated", result });
                })
            });
        } else {
            return res.status(403).json({ message: 'Email does not exist. Do you want to create an account?' })
        }
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ message: 'An error occurred while resetting password' })
    }
}