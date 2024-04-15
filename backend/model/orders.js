import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from "../config/connection.js";
import { Customer } from './customer.js';
import { Product } from './products.js';
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

export { Order };
