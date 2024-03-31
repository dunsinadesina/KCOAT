'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Execute the migration to drop the columns
    await queryInterface.removeColumn('customers', 'username');
    //await queryInterface.removeColumn('customers', 'phoneNumber');
    await queryInterface.removeColumn('customers', 'address');
  },

  down: async (queryInterface, Sequelize) => {
    // If needed, you can implement the logic to revert the changes (down migration)
    // For example, if you want to add back the dropped columns, you can do it here
  }
};
