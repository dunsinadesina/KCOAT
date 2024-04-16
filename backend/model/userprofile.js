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
        type: DataTypes.INTEGER,
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
    }
})

UserProfile.sync().then((result) => {
    console.log('User Profile model synced successfully', result);
}).catch((err) => {
    console.log('Error syncing User Profile model', err);
});

export { UserProfile };
