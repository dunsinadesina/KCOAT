// Import necessary modules
import bcrypt from 'bcryptjs';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from "../config/connection.js";

class Customer extends Model { }
// Creating a customer model
Customer.init({
    cusid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    cusName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    emailToken: {
        type: DataTypes.STRING,
    }
},
    {
        sequelize,
        modelName: 'Customer',
        tableName: 'Customers',
        hooks: {
            // Hash the password before saving it
            beforeCreate: async (customer) => {
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

// Sync the Customer model with the database
Customer.sync().then((result) => {
    console.log('Customer model synced successfully', result);
}).catch((err) => {
    console.log('Error syncing Customer model', err);
});

// Export Customer module
export { Customer };
