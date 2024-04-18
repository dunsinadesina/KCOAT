import { DataTypes } from 'sequelize';
import { sequelize } from "../config/connection.js";

const Admin = sequelize.define('Admin', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export { Admin };
