import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../model/admin.js';
const secret = process.env.JWT_SECRET || 'Tech4Dev'

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin.id }, secret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.log('Admin login error: ', error);
        res.status(500).json({ message: 'Server Error' });
    }
}