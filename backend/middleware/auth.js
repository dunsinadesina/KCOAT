import jwt from "jsonwebtoken";
import { Admin } from "../model/admin.js";
const secret = process.env.JWT_SECRET || "Tech4Dev";

// Middleware to sanitize product size and price fields
export const sanitizeProductFields = (req, res, next) => {
    if (req.body.ProductSize) {
        req.body.ProductSize = req.body.ProductSize.replace(/[, ]/g, '').trim();  // Remove commas and trim whitespace
    }

    if (req.body.ProductPrice) {
        req.body.ProductPrice = req.body.ProductPrice.replace(/[, ]/g, '').trim();  // Remove commas and trim whitespace
    }
    next();
}

//middleware to authenticate admin
export const adminAuthMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        req.admin = await Admin.findByPk(decoded.id);
        next();
    } catch (error) {
        console.log('Admin authorization middleware error: ', error);
        res.status(401).json({ message: 'Token not valid' });
    }
}