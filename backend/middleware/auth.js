const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "Tech4Dev";
const { Customer } = require('../model/customer');

const authenticateToken = async(req, res, next) => {
    try{
        if(!req.headers.authorization){
            return res.status(401).json({message:'Unauthorized: Missing token'});
        }
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        const user = await Customer.findOne({where:{email:decoded.email}})
        if (!user){
            return res.status(403).json({message: 'Unauthorized: Invalid token'});
        }
        req.user = decoded;
        next();
    }catch(error){
        console.log('Error in authenticating middleware: ', error);
        res.status(500).json({message: 'Unauthorized: Invalid token'})
    }
};

const isAdmin = async (req, res, next) => {
    try{
        if (req.user.role !== 'admin'){
            return res.status(403).json({message:'Unauthorized: Admin access required'});
        }
        next();
    }catch(error){
        console.log('Error in isAdmin middleware: ', error);
        res.status(500).json({message:'Internal Server Error'});
    }
};

const isCustomer = async (req, res, next) => {
    try {
        if (req.user.role !== 'customer') {
            res.status(403).json({ message: 'Unauthorized: Customer access required' })
        }  
        next();
    } catch (error) {
        console.log('Error in isCustomer middleware: ', error);
        res.status(500).json({ message: 'Unauthorized: Invalid token' })
    }
};

module.exports = {authenticateToken, isAdmin, isCustomer };