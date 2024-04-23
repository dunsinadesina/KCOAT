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
        allowNull: true
    },
    ProductDescription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ProductPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    ProductCategory: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ProductImage: {
        type: DataTypes.JSON,
        allowNull: false
    },
    Quantity:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    SubCategory:{
        type: DataTypes.STRING,
        allowNull: true
    }
})

export { Product };
