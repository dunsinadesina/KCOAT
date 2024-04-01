const mysql = require('mysql2')
//Create a MySQL connection pool
const pool = mysql.createPool({
        connectionLimit: 10,
        host: "bnbzojiokmkdz5sxlsls-mysql.services.clever-cloud.com",
        password: "Ud4qzhPza6BdN3RQXs43",
        user: "uxhytwwevhvdtd8h",
        database: "bnbzojiokmkdz5sxlsls"
    })
//Function to get a connection from the pool
function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) { reject(err) }
            else {
                resolve(connection)
            }
        })
    })
}
//Function to run a SQL query with parameterized values
function runQueryValues(conn, sqlQuery, values) {
    return new Promise((resolve, reject) => {
        conn.query(sqlQuery, values, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}
const signupSyntax = "insert into customer_table(username, userpassword)values(?,?)";

const loginSyntax = "select * from customer_table where username = ?"

const emailLogin = "select * from customers where email = ?"

// const updateLogin = "update users set userpassword = ? where username = ?"

const updateLogin = "update customers set password = ? where email = ?"



module.exports = { getConnection, runQueryValues, emailLogin, updateLogin };