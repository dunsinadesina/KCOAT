//Import neccesary modules
const Sequelize = require('sequelize');
const { sequelize } = require("../config/connection");
const bcrypt = require('bcryptjs');

// creating a customer model
//Defining a Sequelize model for the customer
const Customer = sequelize.define("customer", {
    cusid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    cusName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
},
    {
        hooks: {
            //Hash the password before saving it
            beforeCreate: async (customer, options) => {
                try {
                    if (customer.password) {
                        const salt = await bcrypt.genSalt(10);
                        customer.password = await bcrypt.hash(customer.password, salt);
                    }
                } catch (error) {
                    console.log('Error hashing password:', error);
                    throw new Error('Error hashing password');
                }
            }
        }
    });

//Sync the Customer model with the database
Customer.sync().then((result) => {
    console.log('Customer model synced successfully', result)
}).catch((err) => {
    console.log('Error syncing Customer model', err);
} 
);

//Export Customer module
module.exports = { Customer };