const { Customer } = require('../model/customer');

const insertCus = async (req, res) => {
    const { cusName, email, password } = req.body;
    try {
        if (!cusName || !email ||  || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const existingCustomer = await Customer.findOne({ where: { email: req.body.email } });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer with this email already exists' });
        }

        //const hashedPassword = await bcrypt.hash(password, 10);

        const newCustomer = await Customer.create({
            cusName,
            email,
            password
        });
        return res.status(200).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (err) {
        console.log('Error creating customer:', err);
        return res.status(500).json({ error: 'Error in creating customer' })
    }
}

module.exports = { insertCus };
