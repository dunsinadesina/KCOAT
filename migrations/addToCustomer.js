'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add new columns to the Customer table
        await queryInterface.addColumn('customers', 'address', {
            type: Sequelize.STRING,
            allowNull: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the added columns if needed
        await queryInterface.removeColumn('customers', 'address');
    }
};
