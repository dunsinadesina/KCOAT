const { Customer } = require('../model/customer');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { CustomerAuth } = require('../model/customerAuth');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    userpassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    cusName: Joi.string().min(3).max(100).required(),
    phoneNumber: Joi.string().pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/).required(),
    address: Joi.string().min(3).max(100).required()
});

const insertCus = async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Invalid input in one of the fields', error: error.details });
    }
    
    const cusData = {
        cusName: req.body.cusName,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password: req.body.userpassword,
    };

    try {
        const existingCustomer = await CustomerAuth.findOne({ where: { email: req.body.email } });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer with this email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(cusData.password, 10);
        
        const newCustomer = await Customer.create({
            cusName: cusData.cusName,
            username: cusData.username,
            email: cusData.email,
            phoneNumber: cusData.phoneNumber,
            address: cusData.address,
            password: cusData.password,
        });
        res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (err) {
        console.log('Error creating customer:', err);
        res.status(500).json({ error: 'Server Error' })
    }
}

module.exports = { insertCus };
