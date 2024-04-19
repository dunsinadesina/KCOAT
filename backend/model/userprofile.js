import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';
import { Customer } from './customer.js';

const UserProfile = sequelize.define('UserProfile', {
    UserProfileId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.UUID,
        references:{
            model: Customer,
            key: 'cusid'
        }
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber:{
        type: DataTypes.STRING,
        allowNull: true
    },
    image:{
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    newPassword:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    address:{
        type: DataTypes.STRING,
        allowNull: true
    },
    state:{
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isLoggedIn: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

export { UserProfile };
