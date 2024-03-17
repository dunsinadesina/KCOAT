'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to the Products table
    await queryInterface.addColumn('Products', 'ProductDescription', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Products', 'ProductCategory', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Products', 'ProductImage', {
      type: Sequelize.JSON
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the added columns if needed
    await queryInterface.removeColumn('Products', 'ProductDescription');
    await queryInterface.removeColumn('Products', 'ProductCategory');
    await queryInterface.removeColumn('Products', 'ProductImage');
  }
};
