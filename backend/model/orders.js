const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");
const { OrderProduct } = require('./orderProduct');

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
        // },
        // customerId: {
        //     type: Sequelize.UUID,
        //     allowNull: false,
        //     references: {
        //         model: 'customers',
        //         key: 'cusid'
        //     }
         }
    });
// Define intermediate table OrderProduct


// Define associations
// Order.belongsTo(() => require('./customer').Customer, { foreignKey: 'customerId' });
// Order.belongsToMany(() => require('./products').Product, { through: OrderProduct });
// Order.belongsTo(Customer); // Assuming one order belongs to one customer

// Sync with db
(async () => {
    await sequelize.sync();
    console.log("Order model synchronized with database");
})();

module.exports = { Order };
