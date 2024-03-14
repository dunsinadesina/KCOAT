const mysql = require('mysql2')

const pool = mysql.createPool({
        connectionLimit: 10,
        host: "bnbzojiokmkdz5sxlsls-mysql.services.clever-cloud.com",
        password: "Ud4qzhPza6BdN3RQXs43",
        user: "uxhytwwevhvdtd8h",
        database: "bnbzojiokmkdz5sxlsls"
    })

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

const sql = "insert into product(product_name,unit_price,quantity,total)values(?,?,?,?)";

const signupSyntax = "insert into customer_table(username, userpassword)values(?,?)";

const loginSyntax = "select * from customer_table where username = ?"

//const emailLogin = "select * from users where email = ?"

// const updateLogin = "update users set userpassword = ? where username = ?"

//const updateLogin = "update users set userpassword = ? where email = ?"



module.exports = { getConnection, runQueryValues, sql, signupSyntax, loginSyntax };