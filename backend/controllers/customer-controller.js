const { Customer } = require('../model/customer');

const insertCus = async (req, res) => {
    try {


        const cusData = {
            cusName: req.body.cusName,
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            password: req.body.userpassword,
        };
        if (!cusData.cusName || !cusData.username || !cusData.email || !cusData.phoneNumber || !cusData.address || cusData.password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const existingCustomer = await Customer.findOne({ where: { email: req.body.email } });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer with this email already exists' });
        }

        //const hashedPassword = await bcrypt.hash(cusData.password, 10);

        const newCustomer = await Customer.create(cusData);
        res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (err) {
        console.log('Error creating customer:', err);
        res.status(500).json({ error: 'Server Error' })
    }
}

module.exports = { insertCus };
