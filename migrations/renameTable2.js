'use strict';
module.exports = {
    up:
        async (queryInterface, Sequelize) => {
            //rename the table
            await queryInterface.renameTable('customer_auth', 'customer_auths');
        },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable('customer_auths', 'customer_auth');
    }
};