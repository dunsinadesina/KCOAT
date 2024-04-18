import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../model/admin.js';

const secret = process.env.JWT_SECRET || "Tech4Dev";

export const registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin with the same email already exists
        const existingAdmin = await Admin.findOne({ where: { email: email } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = await Admin.create({
            email: email,
            password: hashedPassword,
        });

        // Generate a token
        const token = jwt.sign({ id: newAdmin.id }, secret, { expiresIn: '1d' });

        // Return the new admin along with the token
        return res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin, token: token });
    } catch (error) {
        console.error('Error registering admin:', error);
        return res.status(500).json({ message: 'An error occurred while registering admin' });
    }
};
