const Sequelize = require('sequelize');  // Add the parentheses here
const dotenv = require('dotenv');
dotenv.config();

//Initialize Sequelize with database credentials
const sequelize = new Sequelize(
    "bnbzojiokmkdz5sxlsls", //database name
    "uxhytwwevhvdtd8h", //username
    "Ud4qzhPza6BdN3RQXs43", //password
    {
        dialect: "mysql",
        host: "bnbzojiokmkdz5sxlsls-mysql.services.clever-cloud.com"
    }
);

sequelize.authenticate().then(() => {
    console.log("connected");
}).catch(err => {
    console.log(err);
});

//Export the initalized Sequelize instance
module.exports = { sequelize };