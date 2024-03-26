'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to the Products table
    await queryInterface.addColumn('Products', 'size', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.addColumn('Products', 'color', {
      type: Sequelize.STRING
    });

    down: async (queryInterface, Sequelize) => {
      // Remove the added columns if needed
      await queryInterface.removeColumn('Products', 'size');
      await queryInterface.removeColumn('Products', 'color');
    }
  }
};
