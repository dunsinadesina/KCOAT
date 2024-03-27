const { Customer } = require('../model/customer');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const {CustomerAuth} = require('../model/customerAuth')
const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    userpassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    cusName: Joi.string().min(3).max(100).required(),
    phoneNumber: Joi.string().pattern(new RegExp('^\\+(?:[0-9] ?){6,14}[0-9]$')).required(),
    address: Joi.string().min(3).max(100).required()
});
//Define the function to insert new customer
const insertCus = async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Invalid input in one of the fields', error:error.details });
    }
    const cusData = {
        //Extract customer data from the request body
        cusName: req.body.cusName,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password: req.body.userpassword,
        //role: req.body.role
    };
    //to check if customer with same email already exists
    const existingCustomer = await CustomerAuth.findOne({ where: { email } });
    if (existingCustomer) {
        return res.status(400).json({ error: 'Customer with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
        //create customer record
        const newCustomer = await Customer.create()({
            cusName,
            username,
            email,
            phoneNumber,
            address,
            password: hashedPassword,
        });

    //Create new customer record using the customer model
    Customer.create(cusData).then(result => {
        res.status(201).json({ message: "Customer created succesfully", customer: result })
    }).catch(err => {
        console.log('Error creating customer:', err);
        res.status(500).json({ error: 'Server Error' })
    })
    //create customer_auths record and assciate it witht the customer record
    await CustomerAuth.create({
        email,
        password: hashedPassword,
        customerId: newCustomer.cusid,
        username: newCustomer.username
    });
}
//Export insertCus function
module.exports = { insertCus };