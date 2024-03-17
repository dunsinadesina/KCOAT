const Sequelize = require('sequelize');
const { Customer } = require('../model/customer');

//Define the function to insert new customer
const insertCus = (req, res) => {
    const cusData = {
        //Extract customer data from the request body
        cusName: req.body.fullname,
        username: req.body.username,
        password: req.body.userpassword
    };
//Create new customer record using the customer model
    Customer.create(cusData).then(result => {
        console.log(result)
    }).catch(err => {
        console.log(err);
    })
}
//Export insertCus function
module.exports = { insertCus };