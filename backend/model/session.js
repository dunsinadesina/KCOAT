const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const Session = sequelize.define('Session', {
    sessionid: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    data: {
        type: DataTypes.TEXT
    },
    expires: {
        type: DataTypes.DATE
    }
},{
    tableName:'Sessions'
}
);

module.exports = { Session };
