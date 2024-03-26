const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");
// const { Customer } = require('./customer')
// const { Order } = require('./orders')
// const { Product } = require('./products')
const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'cusid'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'Productid'
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
//define associations
// Cart.belongsTo(() => require('./customer').Customer, { foreignKey: 'customerId' });
// Cart.belongsToMany(() => require('./products'.Product, { through: () => require('./cart').CartItem }));
// Cart.hasMany(() => require('./orders'.Order));
// Cart.hasMany(() => require('./cart').CartItem);
// Cart.hasMany(() => require('./customer').Customer);

module.exports = { Cart, CartItem };