'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.changeColumn('Products', 'size', {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        } catch (error) {
            console.error('Error updating column type:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.changeColumn('Products', 'size', {
                type: Sequelize.STRING,
                allowNull: true,
            });
        } catch (error) {
            console.error('Error updating column type:', error);
            throw error;
        }
    }
};
