const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");
//const bcrypt = require('bcryptjs');
// const { Cart } = require('./cart');
// const { Order } = require('./orders');
const CustomerAuth = sequelize.define('CustomerAuth', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    customerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'cusid'
        }
    }
}, {
    modelName: 'CustomerAuth'
});
module.exports = { CustomerAuth };