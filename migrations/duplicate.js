'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add an index to the 'cusid' field of the 'customers' table
        //await queryInterface.addIndex('customers', ['cusid']);

        // Add a foreign key constraint to the 'customer_auths' table
        await queryInterface.addConstraint('customer_auths', {
            fields: ['customerId'],
            type: 'foreign key',
            references: {
                table: 'customers',
                field: 'cusid',
            },
            onDelete: 'cascade',
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the foreign key constraint
        await queryInterface.removeConstraint('customer_auths', 'fk_customer_auths_customerId');

        // Remove the index from the 'cusid' field of the 'customers' table
        await queryInterface.removeIndex('customers', ['customer_id']);
    }
};
