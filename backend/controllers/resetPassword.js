import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../model/customer.js';
import { PasswordResetToken } from '../model/passwordreset.js';
import { sendPasswordResetMail } from './mail.js';

const generateToken = () => {
    return uuidv4();
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Customer.findOne({ where: { email } });
        if (user) {
            const token = generateToken();
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);
            await PasswordResetToken.create({ userId: user.cusid, token, expiryDate });
            //send the email with the link containing the token
            await sendPasswordResetMail(email, token);
            return res.status(200).json({ message: 'Password reset link has been sent to your email' });
        } else {
            return res.status(403).json({ message: 'Email does not exist. Do you want to create an account?' });
        }
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Token and Password are required' });
    }
    try {
        const tokenRecord = await PasswordResetToken.findOne({ where: { token } });
        if (!tokenRecord) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        const user = await Customer.findOne({ where: { cusid: tokenRecord.userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword });
        await tokenRecord.destroy();
        return res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ message: 'An error occurred while resetting password' });
    }
}