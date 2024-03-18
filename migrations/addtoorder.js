'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Remove the 'Status' column from the Orders table
        await queryInterface.removeColumn('Orders', 'Status');
    },

    down: async (queryInterface, Sequelize) => {
        // Add back the 'Status' column to the Orders table
        await queryInterface.addColumn('Orders', 'Status', {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: 'pending'
        });
    }
};
