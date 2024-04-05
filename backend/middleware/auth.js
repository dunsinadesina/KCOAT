import jwt from "jsonwebtoken";
import { Customer } from '../model/customer.js';
const secret = process.env.JWT_SECRET || "Tech4Dev";

export const authenticateToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, secret);
        const user = await Customer.findOne({ where: { email: decoded.email } })
        if (!user) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
        }catch (error) {
            if (error instanceof jwt.TokenExpiredError){
                return res.status(401).json({message: "Unauthorized: Token Expired"});
            }else if(error instanceof jwt.JsonWebTokenError){
                return res .status(401).json({message: "Unauthorized: Invalid token"})
            }else{
                throw error;
            }
        }
        
    } catch (error) {
        console.log('Error in authenticating middleware: ', error);
        res.status(500).json({ message: 'Unauthorized: Invalid token' })
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }
        next();
    } catch (error) {
        console.log('Error in isAdmin middleware: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};