const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { Customer } = require('../model/customer');

// Joi schema for input validation
const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    userpassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    cusName: Joi.string().min(3).max(100).required(),
    phoneNumber: Joi.string().pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/).required(),
    address: Joi.string().min(3).max(100).required()
});

// Function to validate input data
const validateInput = (data) => {
    const { error } = schema.validate(data);
    return error ? error.details[0].message : null;
};

const insertCus = async (req, res) => {
    // Validate input data
    const validationError = validateInput(req.body);
    if (validationError) {
        return res.status(400).json({ message: 'Invalid input', error: validationError });
    }

    const { cusName, username, email, phoneNumber, address, userpassword } = req.body;

    try {
        // Check if customer with same email already exists
        const existingCustomer = await Customer.findOne({ where: { email } });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userpassword, 10);

        // Create new customer record using the customer model
        const newCustomer = await Customer.create({
            cusName,
            username,
            email,
            phoneNumber,
            address,
            password: hashedPassword
        });

        return res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (err) {
        console.error('Error creating customer:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { insertCus };
