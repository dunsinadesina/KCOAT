//Import neccesary modules
const {Sequelize, Model, DataTypes} = require('sequelize');
const { sequelize } = require("../config/connection");
const bcrypt = require('bcryptjs');

class CustomerAuth extends Model {}

CustomerAuth.init ({
    //tableName: 'customer_auths',
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
    username:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    customerId: {//foreign key
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'cusid'
        }
    }
}, {
    sequelize,
    modelName: 'customer_auths'
});

// creating a customer model
const Customer = sequelize.define("customer", {
    //tableName: 'customers',
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
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'customers'
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

//relationship between both models
Customer.hasOne(CustomerAuth, { foreignKey: 'customerId' });
CustomerAuth.belongsTo(Customer, { foreignKey: 'customerId' });

//Sync the Customer model with the database
Customer.sync().then((result) => {
    console.log('Customer model synced successfully', result)
}).catch((err) => {
    console.log('Error syncing Customer model', err);
}
);
// sequelize.close()
//   .then(() => {
//     console.log('Database connection closed successfully.');
//   })
//   .catch((error) => {
//     console.error('Error closing database connection:', error);
//   });
//Export Customer module


module.exports = { Customer, CustomerAuth };