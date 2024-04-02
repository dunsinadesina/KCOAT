const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");

const Category = sequelize.define("Category", {
    categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    categoryName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: {
        type: Sequelize.ENUM('Men', 'Women'),
        allowNull: false
    },
    parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Category',
            key: 'categoryId'
        }
    }
});

// Sync the Category model with the database
Category.sync()
    .then((result) => {
        console.log('Category model synced successfully', result);
    })
    .catch((error) => {
        console.log('Error syncing Category model:', error);
    });

module.exports = { Category };
