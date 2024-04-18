import jwt from "jsonwebtoken";
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
    const secret = process.env.JWT_SECRET || "Tech4Dev";
    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).json({ message: 'No token provided, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token, please log in again' });
        } else {
            console.error('Admin authorization middleware error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
