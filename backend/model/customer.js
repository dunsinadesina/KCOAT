// Import necessary modules
const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");
const bcrypt = require('bcryptjs');
const { Cart } = require('./cart');
const { Order } = require('./orders');
const { CustomerAuth } = require('./customerAuth');

// Creating a customer model
const Customer = sequelize.define("customers", {
    cusid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'customers',
    hooks: {
        // Hash the password before saving it
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

// define associations
Customer.hasMany(Order);
Customer.hasOne(Cart);

// Sync the Customer model with the database
Customer.sync().then((result) => {
    console.log('Customer model synced successfully', result);
}).catch((err) => {
    console.log('Error syncing Customer model', err);
});

// Export Customer module
module.exports = { Customer };
