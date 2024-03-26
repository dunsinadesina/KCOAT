const bcrypt = require('bcryptjs');
const { CustomerAuth, Customer } = require('../model/customer');
const signup = async (req, res) => {
    try {
        const { email, password, username, address,cusName } = req.body;
        //validate signup data
        if (!email || !password || !username || !address || !cusName) {
            return res.status(400).json({ error: 'Please provide all required fields', error:error.details });
        }
        //to check if customer with same email already exists
        const existingCustomer = await CustomerAuth.findOne({ where: { email } });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        //create customer record
        const newCustomer = await Customer.create({
            cusName,
            username,
            password: hashedPassword,
            address
        });
        
        //create customer_auths record and assciate it witht the customer record
        await CustomerAuth.create({
            email,
            password: hashedPassword,
            customerId: newCustomer.cusid,
            username: newCustomer.username
        });
        res.status(200).json({ message: 'Customer signed up successfully', customer: newCustomer })
    } catch (err) {
        console.log('Error in Sign up : ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = { signup };