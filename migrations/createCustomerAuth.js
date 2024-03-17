'use strict';

module.exports = {
    up: 
    async (queryInterface, Sequelize) => {
        // Create the CustomerAuth table
        await queryInterface.createTable('CustomerAuth', {
            
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
       
        // Add columns to the customer_auth table
        await queryInterface.addColumn('customer_auth', 'additionalColumn', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the added columns
        await queryInterface.removeColumn('customer_auth', 'additionalColumn');

        
    }
};
