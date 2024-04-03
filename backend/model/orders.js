const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");
const { Customer } = require('./customer')
const { Product } = require('./products')
// Order model
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.ENUM('cart', 'ordered'),
        allowNull: false,
        defaultValue: 'cart'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
    },
    customerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: 'Customers',
            key: 'cusid'
        }
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'Productid'
        }
    }
});

// Define associations
Order.belongsTo(Customer, { foreignKey: 'customerId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

// Sync with db
(async () => {
    await sequelize.sync();
    console.log("Order model synchronized with database");
})();

module.exports = { Order };
