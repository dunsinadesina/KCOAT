import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../model/admin.js';

const secret = process.env.JWT_SECRET || "Tech4Dev";

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Fill all fields' });
        }
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong password' });
        }
        // Generate JWT token
        const token = jwt.sign({ email: admin.email }, secret, { expiresIn: '1h' })
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error registering admin:', error);
        return res.status(500).json({ message: 'An error occurred while registering admin' });
    }
};
