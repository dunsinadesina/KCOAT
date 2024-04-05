import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Customer } from '../model/customer.js';
import { sendVerificationMail } from './mail.js';
const secretKey = process.env.JWT_SECRET || 'Tech4Dev';

export const insertCus = async (req, res) => {
    const { cusName, email, password } = req.body;
    try {
        if (!cusName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const existingCustomer = await Customer.findOne({ where: { email: req.body.email } });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer with this email already exists' });
        }
        const newCustomer = await Customer.create({
            cusName,
            email,
            password,
            emailToken: crypto.randomBytes(64).toString('hex')
        });
        return res.status(200).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (err) {
        console.log('Error creating customer:', err);
        return res.status(500).json({ error: 'Error in creating customer' })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const emailToken = req.body.emailToken;
        if (!emailToken) return res.status(404).json({ message: 'Email token not found...' });
        const user = await Customer.findOne({ where: { emailToken } });
        if (user) {
            user.cusName,
            user.emailToken = null;
            user.isVerified = true;

            await user.save();

            sendVerificationMail(user);
            const createToken = (userId) => {
                return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
            };
            const token = createToken(user.id);
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                token,
                isVerified: user?.isVerified,
            });
        } else {
            res.status(404).json({ message: 'Email Verification failed, invalid token' })
        }
    } catch (error) {
        console.log("Error in email verification: ", error)
        res.status(500).json({ message: 'Server Error!', error })
    }
}