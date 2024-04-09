import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from "../config/connection.js";
import { Customer } from './customer.js';
import { Product } from './products.js';

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
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Define associations
Cart.belongsTo(Customer, { foreignKey: 'customerId' });
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
CartItem.belongsTo(Product);

// Sync models with the database
Cart.sync();
CartItem.sync();

export { Cart, CartItem };
