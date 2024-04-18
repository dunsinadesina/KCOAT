import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Customer } from '../model/customer.js';
import { UserProfile } from '../model/userprofile.js';
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
        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(userpassword, customer.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong password' });
        }
        
        // Update isLoggedIn status to true
        const userProfile = await UserProfile.findOne({ where: { email } });
        if (userProfile) {
            await userProfile.update({ isLoggedIn: true });
        } else {
            console.log('User profile not found for email: ', email);
        }

        // Generate JWT token
        const token = jwt.sign({ email: customer.email }, secret, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log('Login error: ', error);
        return res.status(500).json({ message: 'An error occurred during login' });
    }
}


//Initialize an empty set to store invalidated tokens
const tokenBlacklist = new Set();

export const logout = async (req, res) => {
    const { email } = req.body;
    try {
        // Update isLoggedIn field to false
        const userProfile = await UserProfile.findOne({ where: { email } });
        if (userProfile) {
            await userProfile.update({ isLoggedIn: false });
            return res.status(200).json({ message: 'Logout successful' });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log('Error logging out:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Middleware function to check token blacklist
export const checkTokenBlacklist = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }
    next();
};