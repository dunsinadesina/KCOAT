const {Sequelize, DataTypes} = require('sequelize');
const { sequelize } = require("../config/connection");

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
    ProductSize:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    SubCategory:{
        type: DataTypes.STRING,
        allowNull: false
    }
})
//Sync the Products model with the database
Product.sync();

module.exports = { Product };