const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");
const { Customer } = require('./customer');
const { Product } = require('./products');
// const { Order } = require('./orders')
//Creating cart model
const Cart = sequelize.define('Cart', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'Customers',
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
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Carts',
            key: 'id'
        }
    }
});
//define associations
Cart.belongsTo(Customer, { foreignKey: 'customerId' });
Cart.belongsToMany(Product, { through: CartItem });
CartItem.belongsTo(Product, { foreignKey: 'productId' })
CartItem.belongsTo(Cart, { foreignKey: 'cartId' })

// Cart.sync();
// CartItem.sync();

module.exports = { Cart, CartItem };