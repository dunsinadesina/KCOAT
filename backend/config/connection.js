import { Sequelize } from 'sequelize'; // Add the parentheses here
//const dotenv = require('dotenv');
//dotenv.config();

//Initialize Sequelize with database credentials
export const sequelize = new Sequelize(
    //'mysql://adminjs:adminjs@localhost:6000/adminjs',
    "bz1pou7t8ldxtfxrpota", //database name
    "uqdtlwshmdmzw692", //username
    "1IinTQjo82iT6LCZU3sg", //password
    {
        dialect: "mysql",
        host: "bz1pou7t8ldxtfxrpota-mysql.services.clever-cloud.com"
    }
);

sequelize.authenticate().then(() => {
    console.log("Database connection established.");
}).catch(err => {
    console.log(err);
});