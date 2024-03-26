const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require("../config/connection");

const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING//admin or customer
})

module.exports = { User }