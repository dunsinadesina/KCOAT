import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';
import { Customer } from './customer.js';

const PasswordResetToken = sequelize.define('PasswordResetToken', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: Customer,
            key: 'cusid'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiryDate:{
        type: DataTypes.DATE,
        allowNull: false
    }
});
export { PasswordResetToken };
