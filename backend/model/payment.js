const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");
const { Order } = require('./orders');

const Payments = sequelize.define('Payments', {
    paymentAmount: Sequelize.FLOAT,
    paymentStatus: Sequelize.STRING,
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Order',
            key: 'id'
        }
    }
});
//define associations
Order.hasMany(Payments, { foreignKey: 'orderId' });
Payments.belongsTo(Order, { foreignKey: 'orderId' });

const ordersWithPayments = await Order.findAll({ include: Payments });

Payments.sync().then((result) => {
    console.log('Payments model synced successfully', result);
}).catch((err) => {
    console.log('Error syncing Payment model', err);
});


module.exports = { Payments }