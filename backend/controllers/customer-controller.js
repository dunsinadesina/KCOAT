import crypto from 'crypto';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { Customer } from '../model/customer.js';
import { UserProfile } from '../model/userprofile.js';
import { sendVerificationMail } from './mail.js';
const secretKey = process.env.JWT_SECRET || 'Tech4Dev';


export const insertCus = async (req, res) => {
    const { cusName, email, password } = req.body;

    const [firstName, lastName] = cusName.split(' ');

    const schema = Joi.object({
        cusName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
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

        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        const newUserProfile = await UserProfile.create({
            firstName,
            lastName,
            email,
            customerId: newCustomer.cusid,
            phoneNumber,
            state,
            country,
            address,
            image,
        });
        return res.status(200).json({
            message: 'Customer and User Profile created successfully',
            customer: newCustomer,
            userProfile: newUserProfile
        });
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