// payment.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");
const { Customer } = require('./customer')
const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Customers',
            key: 'cusid'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true
    },

});

Payment.belongsTo(Customer, { foreignKey: 'customerId' });

Payment.sync()

module.exports = { Payment };
