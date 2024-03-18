const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");

const OrderStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered'
};

//order model
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'cusid'
        },
    },
    product_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'Productid'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

//sync with db
(async () => {
    await sequelize.sync();
    console.log("Order model synchronized with database");
})();

module.exports = { Order, OrderStatus };