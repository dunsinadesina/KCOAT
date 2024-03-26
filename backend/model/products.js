const {Sequelize, DataTypes} = require('sequelize');
const { sequelize } = require("../config/connection");

const Product = sequelize.define("Product", {
    Productid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    ProductName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ProductDescription: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ProductPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    ProductCategory: {
        type: Sequelize.STRING
    },
    ProductImage: {
        type: Sequelize.JSON
    }
})
//Sync the Products model with the database
Product.sync();

module.exports = { Product };