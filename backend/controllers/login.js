import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Customer } from '../model/customer.js';
const secret = process.env.JWT_SECRET || "Tech4Dev";

export const login = async (req, res) => {
    const { email, userpassword } = req.body;
    try {
        if (!email || !userpassword) {
            return res.status(400).json({ message: 'Fill all fields' });
        }
        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(404).json({ message: 'Email not found. Do you want to create an account?' });
        }
        //Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(userpassword, customer.password);
        if (passwordMatch) {
                const token = jwt.sign({ email: customer.email }, secret, {expiresIn: '1h'});
                return res.status(200).json({ message: 'Login successful',token });
        }
        else {
            return res.status(401).json({ message: 'Wrong password' });
        }
    } catch (error) {
        console.log('Login error: ', error);
        return res.status(500).json({ message: 'An error occurred during login' });
    }
}

//Initialize an empty set to store invalidated tokens
const tokenBlacklist = new Set();

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        tokenBlacklist.add(token);
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log('Error while loging out');
        return res.status(500).json({ message: 'An error occurred during logout' });
    }
}