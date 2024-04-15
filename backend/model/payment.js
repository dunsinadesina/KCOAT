// payment.js
import { DataTypes } from 'sequelize';
import { sequelize } from "../config/connection.js";
import { Customer } from './customer.js';
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
        type: DataTypes.ENUM('pending', 'success', 'failed'),
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


export { Payment };
