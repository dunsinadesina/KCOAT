import { DataTypes } from 'sequelize';
import { sequelize } from "../config/connection.js";

const Product = sequelize.define("Products", {
    Productid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    ProductName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ProductDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ProductPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    ProductCategory: {
        type: DataTypes.STRING
    },
    ProductImage: {
        type: DataTypes.STRING
    },
    Quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SubCategory:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

export { Product };
