const Sequelize = require('sequelize');
const { Customer } = require('../model/customer');

const insertCus = (req, res) => {
    const cusData = {
        cusName: req.body.fullname,
        username: req.body.username,
        password: req.body.userpassword
    };

    Customer.create(cusData).then(result => {
        console.log(result)
    }).catch(err => {
        console.log(err);
    })
}

module.exports = { insertCus };